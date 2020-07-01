import { TStore } from "../../../stores/Store";

export const LockPointer = (store: TStore) => {
    // check pointerLock support
    const havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    // Gets canvas by id (TO DO: USE A REF)
    const requestedElement = document.getElementById("Canvas");
    requestedElement.requestPointerLock = requestedElement.requestPointerLock
    document.exitPointerLock = document.exitPointerLock

    const isLocked = () => requestedElement === document.pointerLockElement

    requestedElement.addEventListener('click', () => {
        if (!isLocked()) {
            requestedElement.requestPointerLock();
        }
    }, false);

    const changeCallback = () => {
        if (!havePointerLock) return;
        if (isLocked()) {
            document.addEventListener("mousemove", moveCallback, false);
            document.body.classList.add('locked');
        } else {
            document.removeEventListener("mousemove", moveCallback, false);
            document.body.classList.remove('locked');
        }
    }

    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    const moveCallback = (e: { movementX: any; movementY: any; }) => {
        const mouseX = -(e.movementX / window.innerWidth) ;
        const mouseY = -(e.movementY / window.innerHeight);
        const camera = store.camera.camera;
        camera.rotation.x = Math.max( Math.min(camera.rotation.x + mouseY, 1.5708), -1.5708);
        camera.rotation.y += mouseX;
        if (Math.abs(camera.rotation.y) > 6.28319 )
            camera.rotation.y = camera.rotation.y % 6.28319;
    }
}


