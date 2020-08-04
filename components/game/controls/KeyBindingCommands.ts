import { IPlayer, ICamera } from "../../../stores/Store";

const GetDirEffect = (movement) => {
    switch (movement) {
        case "LEFT": return 1.5708;
        case "RIGHT": return -1.5708;
        case "BACKWARDS": return 3.14159;
        default: return 0;
    }
}

const MoveDirection = (player: IPlayer, camera: ICamera, dt: number, movement?: string) => {

    const directionEffect = GetDirEffect(movement);
    const direction = camera.camera.rotation.y + directionEffect;

    const direction_z = Math.cos(direction);
    const direction_x = Math.sin(direction);

    const cPosition = camera.camera.position;
    const pPosition = player.group.position;

    pPosition.setX(pPosition.x - (dt * (direction_x * camera.speed)));
    pPosition.setZ(pPosition.z - (dt * (direction_z * camera.speed)));
    cPosition.set(0,0,3);
    
    camera.camera.position.applyQuaternion(camera.camera.quaternion);
}

export const CommandLeft = (player: IPlayer, camera: ICamera, dt: number) => MoveDirection(player, camera, dt, "LEFT");

export const CommandUp = (player: IPlayer, camera: ICamera, dt: number) => MoveDirection(player, camera, dt);
 
export const CommandRight = (player: IPlayer, camera: ICamera, dt: number) => MoveDirection(player, camera, dt, "RIGHT");

export const CommandDown = (player: IPlayer, camera: ICamera, dt: number) => MoveDirection(player, camera, dt, "BACKWARDS");

export const CommandE = (player: IPlayer, camera: ICamera, dt: number) =>
    player.group.position.setY(player.group.position.y + dt * camera.speed);

export const CommandQ = (player: IPlayer, camera: ICamera, dt: number) =>
    player.group.position.setY(player.group.position.y - dt * camera.speed);