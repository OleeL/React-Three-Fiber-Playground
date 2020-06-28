import { TStore } from "../../../stores/Store";

export const CommandLeft = (store: TStore) => {
    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition = camera.position;
    const pPosition = player.position;

    pPosition.setX(pPosition.x - store.CAMERASPEED);
    cPosition.setX(cPosition.x - store.CAMERASPEED);
}

export const CommandUp = (store: TStore) => {
    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition = camera.position;
    const pPosition = player.position;

    pPosition.setZ(pPosition.z - store.CAMERASPEED);
    cPosition.setZ(cPosition.z - store.CAMERASPEED);
}

export const CommandRight = (store: TStore) => {
    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition = camera.position;
    const pPosition = player.position;

    pPosition.setX(pPosition.x + store.CAMERASPEED);
    cPosition.setX(cPosition.x + store.CAMERASPEED);
}

export const CommandDown = (store: TStore) => {
    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition = camera.position;
    const pPosition = player.position;

    pPosition.setZ(pPosition.z + store.CAMERASPEED);
    cPosition.setZ(cPosition.z + store.CAMERASPEED);
}

export const CommandE = (store: TStore) => {

    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition= camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y + store.CAMERASPEED);
    cPosition.setY(cPosition.y + store.CAMERASPEED);
}

export const CommandQ = (store: TStore) => {
    
    const {camera, player} = store;
    if (!camera || player == null) return;
    const cPosition = camera.position;
    const pPosition = player.position;

    pPosition.setY(pPosition.y - store.CAMERASPEED);
    cPosition.setY(cPosition.y - store.CAMERASPEED);
}