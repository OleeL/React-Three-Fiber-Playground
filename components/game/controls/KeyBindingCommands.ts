import { IPlayer, ICamera, useStore } from '../../../stores/Store';
import { ObjectValues } from '../../../types/helpers';
import { GetChunkX, GetChunkY } from '../../terrain/terrain';

const DIRECTIONS = {
	LEFT: 'left',
	RIGHT: 'right',
	BACKWARDS: 'backwards',
};

type Direction = ObjectValues<typeof DIRECTIONS>;

const GetDirEffect = (movement: Direction) => {
	switch (movement) {
		case DIRECTIONS.LEFT:
			return 1.5708;
		case DIRECTIONS.RIGHT:
			return -1.5708;
		case DIRECTIONS.BACKWARDS:
			return 3.14159;
		default:
			return 0;
	}
};

const MoveDirection = (
	player: IPlayer,
	camera: ICamera,
	dt: number,
	movement?: Direction,
) => {
	const { chunk, setChunk } = useStore.getState();

	const directionEffect = GetDirEffect(movement);
	const direction = camera.camera.rotation.y + directionEffect;

	const directionZ = Math.cos(direction);
	const directionX = Math.sin(direction);

	const cPosition = camera.camera.position;
	const pPosition = player.group.position;

	const cX = GetChunkX(pPosition.x, 25);
	const cY = GetChunkY(pPosition.z, 25);

	if (chunk.x !== cX || chunk.y !== cY) setChunk(cX, cY);

	pPosition.setX(pPosition.x - dt * (directionX * camera.speed));
	pPosition.setZ(pPosition.z - dt * (directionZ * camera.speed));
	cPosition.set(0, 0, camera.distance);

	camera.camera.position.applyQuaternion(camera.camera.quaternion);
};

export const CommandLeft = (player: IPlayer, camera: ICamera, dt: number) =>
	MoveDirection(player, camera, dt, DIRECTIONS.LEFT);

export const CommandUp = (player: IPlayer, camera: ICamera, dt: number) =>
	MoveDirection(player, camera, dt);

export const CommandRight = (player: IPlayer, camera: ICamera, dt: number) =>
	MoveDirection(player, camera, dt, DIRECTIONS.RIGHT);

export const CommandDown = (player: IPlayer, camera: ICamera, dt: number) =>
	MoveDirection(player, camera, dt, DIRECTIONS.BACKWARDS);

export const CommandE = (player: IPlayer, camera: ICamera, dt: number) =>
	player.group.position.setY(
		player.group.position.y + dt * (camera.speed * 0.5),
	);

export const CommandQ = (player: IPlayer, camera: ICamera, dt: number) =>
	player.group.position.setY(
		player.group.position.y - dt * (camera.speed * 0.5),
	);
