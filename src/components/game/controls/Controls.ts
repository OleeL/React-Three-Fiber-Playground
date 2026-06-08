import { Vector3 } from 'three';
import {
	LEFT,
	UP,
	RIGHT,
	DOWN,
	CODELEFT,
	CODEUP,
	CODERIGHT,
	CODEDOWN,
	Q,
	E,
	CODEE,
	CODEQ,
	CODESPACE,
	SPACE,
} from './KeyBindingConfig';
import { LockPointer } from './PointerLockControls';
import { ICamera, IPlayer, useStore } from '../../../stores/Store';
import { GetChunkX, GetChunkY } from '../../terrain/terrain';

const codeToKey = new Map<number, string>();
const keysDown: string[] = [];
const forward = new Vector3();
const cameraPosition = new Vector3();
const cameraTarget = new Vector3();
let controlsCreated = false;

const CRUISE_SPEED = 45;
const BOOST_SPEED = 65;
const SLOW_SPEED = 28;
const PITCH_RATE = 0.9;
const YAW_RATE = 0.75;
const MAX_PITCH = Math.PI / 7;
const MAX_BANK = Math.PI / 5;
const PITCH_RETURN_RATE = 1.6;
const BANK_RETURN_RATE = 4;
const ALTITUDE_HOLD_RESPONSE = 2.5;
const MOUSE_LOOK_IDLE_MS = 1000;
const MOUSE_LOOK_RETURN_RATE = 2.6;
const THIRD_PERSON_OFFSET = new Vector3(0, 3, 14);
const THIRD_PERSON_TARGET = new Vector3(0, 0.5, 0);
const FIRST_PERSON_OFFSET = new Vector3(0, 0.75, -1.5);
const FIRST_PERSON_TARGET = new Vector3(0, 0.75, -30);

const RegisterKeyBinds = () => {
	CODELEFT.forEach(key => codeToKey.set(key, LEFT));
	CODEUP.forEach(key => codeToKey.set(key, UP));
	CODERIGHT.forEach(key => codeToKey.set(key, RIGHT));
	CODEDOWN.forEach(key => codeToKey.set(key, DOWN));
	CODEE.forEach(key => codeToKey.set(key, E));
	CODEQ.forEach(key => codeToKey.set(key, Q));
	CODESPACE.forEach(key => codeToKey.set(key, SPACE));
};

const onDocumentKeyDown = (event: {
	which: number;
	preventDefault?: () => void;
}) => {
	const keyCode: number = event.which;
	if (!codeToKey.has(keyCode)) return;
	const key = codeToKey.get(keyCode);
	if (!key) return;
	if (key === SPACE) {
		event.preventDefault?.();
		const { camera } = useStore.getState();
		camera.perspective =
			camera.perspective === 'thirdPerson' ? 'firstPerson' : 'thirdPerson';
		return;
	}
	if (keysDown.includes(key)) return;
	keysDown.push(key);
};

const onDocumentKeyUp = (event: { which: number }) => {
	const keyCode: number = event.which;
	const key = codeToKey.get(keyCode);
	if (!key) return;
	const index = keysDown.indexOf(key);
	if (index >= 0) keysDown.splice(index, 1);
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const dampToward = (value: number, target: number, rate: number, dt: number) =>
	value + (target - value) * Math.min(1, rate * dt);

const updateCamera = (player: IPlayer, camera: ICamera, dt: number) => {
	const offset =
		camera.perspective === 'thirdPerson'
			? THIRD_PERSON_OFFSET
			: FIRST_PERSON_OFFSET;
	const target =
		camera.perspective === 'thirdPerson'
			? THIRD_PERSON_TARGET
			: FIRST_PERSON_TARGET;

	if (performance.now() - camera.mouseLook.lastInputAt > MOUSE_LOOK_IDLE_MS) {
		camera.mouseLook.yaw = dampToward(
			camera.mouseLook.yaw,
			0,
			MOUSE_LOOK_RETURN_RATE,
			dt,
		);
		camera.mouseLook.pitch = dampToward(
			camera.mouseLook.pitch,
			0,
			MOUSE_LOOK_RETURN_RATE,
			dt,
		);
	}

	const lookScale = camera.perspective === 'thirdPerson' ? 10 : 28;

	player.group.updateMatrixWorld();
	cameraPosition.copy(offset);
	cameraTarget.copy(target);
	cameraTarget.x += camera.mouseLook.yaw * lookScale;
	cameraTarget.y += camera.mouseLook.pitch * lookScale;
	player.group.localToWorld(cameraPosition);
	player.group.localToWorld(cameraTarget);
	camera.camera.position.copy(cameraPosition);
	camera.camera.lookAt(cameraTarget);
};

export const LoopControls = (dt: number, player: IPlayer, camera: ICamera) => {
	const frameDt = Math.min(dt, 0.05);
	const pitchInput =
		Number(keysDown.includes(DOWN)) - Number(keysDown.includes(UP));
	const yawInput =
		Number(keysDown.includes(LEFT)) - Number(keysDown.includes(RIGHT));
	const throttleInput =
		Number(keysDown.includes(E)) - Number(keysDown.includes(Q));
	let speed = CRUISE_SPEED;
	if (throttleInput > 0) {
		speed = BOOST_SPEED;
	} else if (throttleInput < 0) {
		speed = SLOW_SPEED;
	}
	const { chunk, setChunk, chunkSize } = useStore.getState();
	const { group, flight } = player;

	if (pitchInput !== 0) {
		flight.pitch = clamp(
			flight.pitch + pitchInput * PITCH_RATE * frameDt,
			-MAX_PITCH,
			MAX_PITCH,
		);
	} else {
		flight.pitch = dampToward(flight.pitch, 0, PITCH_RETURN_RATE, frameDt);
	}

	group.rotation.y += yawInput * YAW_RATE * frameDt;
	flight.roll = dampToward(
		flight.roll,
		yawInput * MAX_BANK,
		BANK_RETURN_RATE,
		frameDt,
	);
	group.rotation.x = flight.pitch;
	group.rotation.z = flight.roll;

	forward.set(0, 0, -1).applyQuaternion(group.quaternion);
	group.position.addScaledVector(forward, speed * frameDt);

	if (pitchInput !== 0) {
		flight.targetAltitude = group.position.y;
	} else {
		group.position.y = dampToward(
			group.position.y,
			flight.targetAltitude,
			ALTITUDE_HOLD_RESPONSE,
			frameDt,
		);
	}

	const cX = GetChunkX(group.position.x, chunkSize);
	const cY = GetChunkY(group.position.z, chunkSize);
	if (chunk.x !== cX || chunk.y !== cY) setChunk({ x: cX, y: cY });

	updateCamera(player, camera, frameDt);
};

const CreateControls = () => {
	if (controlsCreated) return;
	if (typeof window === 'undefined' || typeof document === 'undefined') return;
	if (!document.getElementById('Canvas')) return;

	controlsCreated = true;
	RegisterKeyBinds();
	window.addEventListener('keydown', onDocumentKeyDown, false);
	window.addEventListener('keyup', onDocumentKeyUp, false);
	LockPointer();
};

export default CreateControls;
