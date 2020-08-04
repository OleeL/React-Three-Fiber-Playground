import { IVelocity, _store, ICamera, IPlayer } from "../../../stores/Store";
import { Vector3, Quaternion, Euler, Group } from "three"
import { mod } from "../../../helpers/vectors";

const group = new Group();

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

        camera.camera.rotation.y += mouseX * camera.sensitivity.y;
        camera.camera.rotation.y = mod(camera.camera.rotation.y, Math.PI * 2);
        camera.camera.rotation.x = 
            Math.max(Math.min(camera.camera.rotation.x + (mouseY * camera.sensitivity.x), Math.PI / 2), -Math.PI / 2);
        
        const direction_yz = Math.cos(camera.camera.rotation.y);
        const direction_yx = Math.sin(camera.camera.rotation.y);
        const direction_xz = Math.cos(camera.camera.rotation.x);
        const direction_xy = -Math.sin(camera.camera.rotation.x);
        const direction_zx = -Math.sin(camera.camera.rotation.x);
        
        camera.camera.position.set(
            player.player.position.x,
            player.player.position.y,
            player.player.position.z
        );
        
        // camera.euler.set(camera.camera.rotation.x, camera.camera.rotation.y, camera.camera.rotation.z, "YXZ");
        // camera.camera.quaternion.setFromEuler(camera.euler)
        
        camera.camera.position.applyQuaternion(camera.camera.quaternion);
        // camera.camera.rotation.
        group.position.set(player.position.x, player.position.y, player.position.z);
        // group.add(camera.camera);
        
        
        // camera.camera.position.z += ((Math.cos(camera.camera.rotation.x)) * 3);
        // camera.camera.position.z += ((Math.sin(camera.camera.rotation.x)) * 3);
        // camera.camera.position.z += ((-Math.sin(camera.camera.rotation.x)) * 3);
        // camera.camera.position.z += ((Math.cos(camera.camera.rotation.x)) * 3);
        
        // camera.camera.position.z += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.z += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.z += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.z += ((Math.sin(camera.camera.rotation.y)) * 3);


        // camera.camera.position.x += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.x += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.x += ((Math.sin(camera.camera.rotation.y)) * 3);
        // camera.camera.position.x += ((Math.sin(camera.camera.rotation.y)) * 3);


        // camera.camera.position.y += (-Math.sin(camera.camera.rotation.x) * 3);

    }
}

const RotationMatrixX = (x: number): Vector3 => new Vector3();

export const LoopMouseControl = ( dt: number ) => {
    const addStats = _store.getState().addStats;
    const camera = _store.getState().camera;
    const player = _store.getState().player;

    addStats({name: "rotation-x", value: camera.camera.rotation.x.toString()});
    addStats({name: "rotation-y", value: camera.camera.rotation.y.toString()});
    // addStats({name: "cosXRotation", value: Math.cos(camera.camera.rotation.x)});
    // addStats({name: "sinXRotation", value: Math.sin(camera.camera.rotation.x)});
    // addStats({name: "cosYRotation", value: Math.cos(camera.camera.rotation.y)});
    // addStats({name: "sinYRotation", value: Math.sin(camera.camera.rotation.y)});
    addStats({name: "camera-pos-x", value: camera.camera.position.x.toString()});
    addStats({name: "camera-pos-y", value: camera.camera.position.y.toString()});
    addStats({name: "camera-pos-z", value: camera.camera.position.z.toString()});
    addStats({name: "player-pos-x", value: player.player.position.x.toString()});
    addStats({name: "player-pos-y", value: player.player.position.y.toString()});
    addStats({name: "player-pos-z", value: player.player.position.z.toString()});
    // addStats({name: "quat-x", value: camera.camera.quaternion.x.toString()});
    // addStats({name: "quat-y", value: camera.camera.quaternion.y.toString()});
    // addStats({name: "quat-z", value: camera.camera.quaternion.z.toString()});
    // addStats({name: "quat-w", value: camera.camera.quaternion.w.toString()});
}

const ApplyFriction = (vector: IVelocity, friction: number, dt: number) => {
    vector.xvel *= (dt*friction);
    vector.yvel *= (dt*friction);
    vector.zvel *= (dt*friction);
}