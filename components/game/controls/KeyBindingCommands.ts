import { TStore } from "../../../stores/Store";
import { PerspectiveCamera } from "three";


const GetDirEffect = (movement) => {
    switch (movement) {
        case "LEFT": return 1.5708;
        case "RIGHT": return -1.5708;
        case "BACKWARDS": return 3.14159;
        default: return 0;
    }
}

const MoveDirection = (store: TStore, movement? : string) => {
    
    const {camera, player} = store;
    if (!camera || !camera.camera || !player) return;

    let directionEffect = 0;
    if (movement) directionEffect = GetDirEffect(movement);
    const direction = camera.camera.rotation.y + directionEffect;

    const direction_z = Math.cos(direction);
    const direction_x = Math.sin(direction);

    const cPosition = camera.camera.position;
    const pPosition = player.position;

    pPosition.setX(pPosition.x - (direction_x * store.CAMERASPEED));
    cPosition.setX(cPosition.x - (direction_x * store.CAMERASPEED));
    pPosition.setZ(pPosition.z - (direction_z * store.CAMERASPEED));
    cPosition.setZ(cPosition.z - (direction_z * store.CAMERASPEED));
}

export const CommandLeft = (store: TStore) => MoveDirection(store, "LEFT");

export const CommandUp = (store: TStore) => MoveDirection(store);

export const CommandRight = (store: TStore) => MoveDirection(store, "RIGHT");

export const CommandDown = (store: TStore) => MoveDirection(store, "BACKWARDS");

export const CommandE = (store: TStore) => {
    const {camera, player} = store;
    if (!camera || !camera.camera || !player) return;
    const cPosition= camera.camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y + store.CAMERASPEED);
    cPosition.setY(cPosition.y + store.CAMERASPEED);
}

export const CommandQ = (store: TStore) => {
    
    const {camera, player} = store;
    if (!camera || !camera.camera || !player) return;
    const cPosition = camera.camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y - store.CAMERASPEED);
    cPosition.setY(cPosition.y - store.CAMERASPEED);
}