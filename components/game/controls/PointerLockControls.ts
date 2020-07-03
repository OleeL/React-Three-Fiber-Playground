import { TStore, IVelocity } from "../../../stores/Store";

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
        const camera = store.camera;
        const player = store.player.player;
        
        const direction = camera.rotation.y;
        const direction_z = Math.cos(direction);
        const direction_x = Math.sin(direction);

        // camera.movementVelocity.xvel += (direction_x * 3);
        // camera.movementVelocity.zvel += (direction_z * 3);

        console.log(mouseX, mouseY);
        camera.rotationalVelocity.yvel += mouseX * camera.sensitivity.y;
        camera.rotationalVelocity.xvel += mouseY * camera.sensitivity.x;
    }
}

export const LoopMouseControl = ( store: TStore, dt: number ) => {
    const camera = store.camera;
    const player = store.player;

	camera.camera.position.x += camera.movementVelocity.xvel * dt;
    camera.camera.position.y += camera.movementVelocity.yvel * dt;
    camera.camera.position.z += camera.movementVelocity.zvel * dt;

    camera.camera.rotation.x += camera.rotationalVelocity.xvel;
    camera.camera.rotation.z += camera.rotationalVelocity.zvel;
    camera.camera.rotation.y += camera.rotationalVelocity.yvel % 6.28319;
    if (Math.abs(camera.rotation.y) > 6.28319 ) camera.camera.rotation.y = camera.camera.rotation.y & 6.28319
    if (Math.abs(camera.rotation.x) > 1.57080 ) camera.camera.rotation.x = Math.max( Math.min(camera.camera.rotation.x, 1.5708), -1.5708);

	ApplyFriction(camera.movementVelocity, camera.friction, dt);
    ApplyFriction(camera.rotationalVelocity, camera.friction, dt);
}

const ApplyFriction = (vector: IVelocity, friction: number, dt: number) => {
    vector.xvel *= GetFriction(friction, dt);
    vector.yvel *= GetFriction(friction, dt);
    vector.zvel *= GetFriction(friction, dt);
}

const GetFriction = (friction: number, dt: number) => (1 - Math.min(dt*friction, 1))