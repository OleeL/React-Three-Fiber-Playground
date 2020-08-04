import { IVelocity, _store, ICamera, IPlayer } from "../../../stores/Store";
import { Vector3, Quaternion, Euler, Group, PerspectiveCamera } from "three"
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
        const player: IPlayer = _store.getState().player;
        const cam: PerspectiveCamera = camera.camera;

        cam.rotation.y += mouseX * camera.sensitivity.y;
        cam.rotation.y = mod(cam.rotation.y, Math.PI * 2);
        cam.rotation.x = 
            Math.max(Math.min(cam.rotation.x + (mouseY * camera.sensitivity.x), Math.PI / 2), -Math.PI / 2);
        
        cam.position.set(0,0,3);
        cam.position.applyQuaternion(camera.camera.quaternion);
    }
}

export const LoopMouseControl = ( dt: number ) => {
    const addStats = _store.getState().addStats;
    const camera = _store.getState().camera;
    const player = _store.getState().player;

    addStats({name: "rotation-x", value: camera.camera.rotation.x.toString()});
    addStats({name: "rotation-y", value: camera.camera.rotation.y.toString()});
    addStats({name: "player-pos-x", value: player.player.position.x.toString()});
    addStats({name: "player-pos-y", value: player.player.position.y.toString()});
    addStats({name: "player-pos-z", value: player.player.position.z.toString()});
}