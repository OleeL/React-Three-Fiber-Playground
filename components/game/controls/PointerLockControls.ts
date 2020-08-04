import { _store, ICamera } from "../../../stores/Store";
import { PerspectiveCamera } from "three"
import { mod } from "../../../helpers/vectors";

export const LockPointer = () => {
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
        const mouseX = -(e.movementX / window.innerWidth);
        const mouseY = -(e.movementY / window.innerHeight);
        const camera: ICamera = _store.getState().camera;
        const cam: PerspectiveCamera = camera.camera;

        cam.rotation.y += mouseX * camera.sensitivity.y;
        cam.rotation.y = mod(cam.rotation.y, Math.PI * 2);
        cam.rotation.x =
            Math.max(Math.min(cam.rotation.x + (mouseY * camera.sensitivity.x), Math.PI / 2), -Math.PI / 2);

        cam.position.set(0, 0, camera.distance);
        cam.position.applyQuaternion(camera.camera.quaternion);
    }
}