import { TStore } from "../../../stores/Store";

const GetDirEffect = (movement) => {
    switch (movement) {
        case "LEFT": return 1.5708;
        case "RIGHT": return -1.5708;
        case "BACKWARDS": return 3.14159;
        default: return 0;
    }
}

const MoveDirection = (store: TStore, dt: number, movement?: string) => {
    
    const {camera, player, clock} = store;

    const directionEffect = GetDirEffect(movement);
    const direction = camera.camera.rotation.y + directionEffect;

    const direction_z = Math.cos(direction);
    const direction_x = Math.sin(direction);

    const cPosition = camera.camera.position;
    const pPosition = player.player.position;

    pPosition.setX(pPosition.x - (dt * (direction_x * camera.speed)));
    cPosition.setX(cPosition.x - (dt * (direction_x * camera.speed)));
    pPosition.setZ(pPosition.z - (dt * (direction_z * camera.speed)));
    cPosition.setZ(cPosition.z - (dt * (direction_z * camera.speed)));
}

export const CommandLeft = (store: TStore, dt: number) => MoveDirection(store, dt, "LEFT");

export const CommandUp = (store: TStore, dt: number) => MoveDirection(store, dt);
 
export const CommandRight = (store: TStore, dt: number) => MoveDirection(store, dt, "RIGHT");

export const CommandDown = (store: TStore, dt: number) => MoveDirection(store, dt, "BACKWARDS");

export const CommandE = (store: TStore, dt: number) => {
    const {camera, player} = store;
    const cPosition= camera.camera.position;
    const pPosition = player.player.position;

    pPosition.setY(pPosition.y + dt * camera.speed);
    cPosition.setY(cPosition.y + dt * camera.speed);
}

export const CommandQ = (store: TStore, dt: number) => {
    
    const {camera, player} = store;
    const cPosition = camera.camera.position;
    const pPosition = player.player.position;

    pPosition.setY(pPosition.y - dt * camera.speed);
    cPosition.setY(cPosition.y - dt * camera.speed);
}