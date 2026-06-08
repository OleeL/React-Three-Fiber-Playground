import { useStore } from '../../../stores/Store';

const MAX_MOUSE_LOOK_YAW = Math.PI * 0.45;
const MAX_MOUSE_LOOK_PITCH = Math.PI * 0.3;
const MOUSE_LOOK_SCALE = 8;

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export const LockPointer = () => {
	// check pointerLock support
	const havePointerLock =
		'pointerLockElement' in document ||
		'mozPointerLockElement' in document ||
		'webkitPointerLockElement' in document;

	// Gets canvas by id (TO DO: USE A REF)
	const requestedElement = document.getElementById('Canvas');
	if (!requestedElement) return;
	// eslint-disable-next-line no-self-assign
	document.exitPointerLock = document.exitPointerLock;

	const isLocked = () => requestedElement === document.pointerLockElement;

	requestedElement.addEventListener(
		'click',
		() => {
			if (!isLocked()) {
				requestedElement.requestPointerLock();
			}
		},
		false,
	);

	const moveCallback = (e: { movementX: number; movementY: number }) => {
		const { camera } = useStore.getState();
		const { mouseLook } = camera;
		const mouseX = (e.movementX / window.innerWidth) * camera.sensitivity.y;
		const mouseY = (e.movementY / window.innerHeight) * camera.sensitivity.x;

		mouseLook.yaw = clamp(
			mouseLook.yaw + mouseX * MOUSE_LOOK_SCALE,
			-MAX_MOUSE_LOOK_YAW,
			MAX_MOUSE_LOOK_YAW,
		);
		mouseLook.pitch = clamp(
			mouseLook.pitch - mouseY * MOUSE_LOOK_SCALE,
			-MAX_MOUSE_LOOK_PITCH,
			MAX_MOUSE_LOOK_PITCH,
		);
		mouseLook.lastInputAt = performance.now();
	};

	const changeCallback = () => {
		if (!havePointerLock) return;
		if (isLocked()) {
			document.addEventListener('mousemove', moveCallback, false);
			document.body.classList.add('locked');
		} else {
			document.removeEventListener('mousemove', moveCallback, false);
			document.body.classList.remove('locked');
		}
	};

	document.addEventListener('pointerlockchange', changeCallback, false);
	document.addEventListener('mozpointerlockchange', changeCallback, false);
	document.addEventListener('webkitpointerlockchange', changeCallback, false);
};
