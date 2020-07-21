import { IVelocity } from "../../../stores/Store";

export const LockPointer = (store) => {
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
        const {camera, player} = store;

        camera.camera.rotation.y += (mouseX * camera.sensitivity.y);
        camera.camera.rotation.x += (mouseY * camera.sensitivity.x);
        
        const direction   = camera.camera.rotation.y;
        const direction_z = Math.cos(direction);
        const direction_x = Math.sin(direction);
        

        camera.camera.position.x = player.player.position.x + (direction_x * 3);
        camera.camera.position.z = player.player.position.z + (direction_z * 3);
        camera.camera.position.y = player.player.position.y + (-camera.camera.rotation.x * 3);
        
    }
}

export const LoopMouseControl = ( store, dt: number ) => {
    const camera = store.camera;

    store.addStats({name: "rotation-x", value: camera.camera.rotation.x.toString()});
    store.addStats({name: "rotation-y", value: camera.camera.rotation.y.toString()});
    store.addStats({name: "rotation-z", value: camera.camera.rotation.z.toString()});

    store.addStats({name: "camera-pos-x", value: camera.camera.position.x.toString()});
    store.addStats({name: "camera-pos-y", value: camera.camera.position.y.toString()});
    store.addStats({name: "camera-pos-z", value: camera.camera.position.z.toString()});
}

const ApplyFriction = (vector: IVelocity, friction: number, dt: number) => {
    vector.xvel *= (dt*friction);
    vector.yvel *= (dt*friction);
    vector.zvel *= (dt*friction);
}