import { IPlayer, ICamera, _store } from "../../../stores/Store";
import { GetChunkX, GetChunkY } from "../../terrain/terrain";

const GetDirEffect = (movement: direction) => {
    switch (movement) {
        case direction.LEFT: return 1.5708;
        case direction.RIGHT: return -1.5708;
        case direction.BACKWARDS: return 3.14159;
        default: return 0;
    }
}

enum direction {
    LEFT,
    RIGHT,
    BACKWARDS
}


const MoveDirection = (player: IPlayer, camera: ICamera, dt: number, movement?: direction) => {
    const { chunk, setChunk } = _store.getState();

    const directionEffect = GetDirEffect(movement);
    const direction = camera.camera.rotation.y + directionEffect;

    const direction_z = Math.cos(direction);
    const direction_x = Math.sin(direction);

    const cPosition = camera.camera.position;
    const pPosition = player.group.position;

    const cX = GetChunkX(pPosition.x, 25);
    const cY = GetChunkY(pPosition.z, 25);

    if (chunk.x !== cX || chunk.y !== cY) setChunk({x: cX, y: cY});

    pPosition.setX(pPosition.x - (dt * (direction_x * camera.speed)));
    pPosition.setZ(pPosition.z - (dt * (direction_z * camera.speed)));
    cPosition.set(0,0,camera.distance);
    
    camera.camera.position.applyQuaternion(camera.camera.quaternion);
}

export const CommandLeft = (player: IPlayer, camera: ICamera, dt: number) =>
    MoveDirection(player, camera, dt, direction.LEFT);

export const CommandUp = (player: IPlayer, camera: ICamera, dt: number) =>
    MoveDirection(player, camera, dt);
 
export const CommandRight = (player: IPlayer, camera: ICamera, dt: number) =>
    MoveDirection(player, camera, dt, direction.RIGHT);

export const CommandDown = (player: IPlayer, camera: ICamera, dt: number) =>
    MoveDirection(player, camera, dt, direction.BACKWARDS);

export const CommandE = (player: IPlayer, camera: ICamera, dt: number) =>
    player.group.position.setY(player.group.position.y + dt * (camera.speed * 0.5));

export const CommandQ = (player: IPlayer, camera: ICamera, dt: number) =>
    player.group.position.setY(player.group.position.y - dt * (camera.speed * 0.5));