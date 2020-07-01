import { TStore } from "../../../stores/Store";

const GetDirEffect = (movement) => {
    switch (movement) {
        case "LEFT": return 1.5708;
        case "RIGHT": return -1.5708;
        case "BACKWARDS": return 3.14159;
        default: return 0;
    }
}

const MoveDirection = (store: TStore, movement? : string, dt: number) => {
    
    const {camera, player, clock} = store;

    let directionEffect = 0;
    if (movement) directionEffect = GetDirEffect(movement);
    const direction = camera.camera.rotation.y + directionEffect;

    const direction_z = Math.cos(direction);
    const direction_x = Math.sin(direction);

    const cPosition = camera.camera.position;
    const pPosition = player.position;

    pPosition.setX(pPosition.x - (dt * (direction_x * camera.speed)));
    cPosition.setX(cPosition.x - (dt * (direction_x * camera.speed)));
    pPosition.setZ(pPosition.z - (dt * (direction_z * camera.speed)));
    cPosition.setZ(cPosition.z - (dt * (direction_z * camera.speed)));
}

export const CommandLeft = (store: TStore, dt: number) => MoveDirection(store, "LEFT", dt);

export const CommandUp = (store: TStore, dt: number) => MoveDirection(store, "FORWARD", dt);

export const CommandRight = (store: TStore, dt: number) => MoveDirection(store, "RIGHT", dt);

export const CommandDown = (store: TStore, dt: number) => MoveDirection(store, "BACKWARDS", dt);

export const CommandE = (store: TStore, dt: number) => {
    const {camera, player} = store;
    if (!camera || !camera.camera || !player) return;
    const cPosition= camera.camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y + camera.speed);
    cPosition.setY(cPosition.y + camera.speed);
}

export const CommandQ = (store: TStore, dt: number) => {
    
    const {camera, player} = store;
    if (!camera || !camera.camera || !player) return;
    const cPosition = camera.camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y - camera.speed);
    cPosition.setY(cPosition.y - camera.speed);
}