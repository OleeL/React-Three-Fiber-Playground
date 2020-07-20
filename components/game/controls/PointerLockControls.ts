import { TStore, IVelocity } from "../../../stores/Store";
import { Vector3 } from "three";
import { distance, mod } from "../../../helpers/vectors";

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
        const mouseX = -(e.movementX / window.innerWidth);
        const mouseY = -(e.movementY / window.innerHeight);
        const {camera, player} = store;

        camera.rotation.y += (mouseX * camera.sensitivity.y);
        camera.rotation.x += (mouseY * camera.sensitivity.x);
        
        const direction     = camera.rotation.y;
        const direction_z   = Math.cos(direction);
        const direction_x   = Math.sin(direction);

        camera.position.x = player.player.position.x + direction_x * 3;
        camera.position.z = player.player.position.z + direction_z * 3;
    }
}

export const LoopMouseControl = ( store: TStore, dt: number ) => {
    const camera        = store.camera;
    const player        = store.player;
    const spd           = camera.movementSpeed;
    const spd2          = camera.speed;
    const c_location    = camera.camera.position;
    const c_rotation    = camera.camera.rotation;
    const c_rDest       = camera.rotation;
    const c_destination = camera.position;

    store.addStats({name: "rotation", value: ""+camera.rotation.x})
    
    if (distance(c_destination, c_location) > .2)
    {
        camera.movementVelocity.xvel += (mod(c_location.x - c_destination.x, Math.PI * 2) > Math.PI)
            ? dt * spd
            : dt * (-spd);
        // camera.movementVelocity.yvel += (mod(c_location.y - c_destination.y, Math.PI * 2) > Math.PI)
        //     ? dt * spd
        //     : dt * (-spd);
        camera.movementVelocity.zvel += (mod(c_location.z - c_destination.z, Math.PI * 2) > Math.PI)
            ? dt * spd
            : dt * (-spd);
    }

    if (distance(c_rDest, c_rotation) > .1)
    {
        
        camera.rotationalVelocity.xvel += (mod(c_rotation.x - c_rDest.x, Math.PI * 2) > Math.PI)
            ? dt * spd2
            : dt * (-spd2);
        camera.rotationalVelocity.yvel += (mod(c_rotation.y - c_rDest.y, Math.PI * 2) > Math.PI)
            ? dt * spd2
            : dt * (-spd2);
        // camera.movementVelocity.zvel += (mod(c_location.z - c_destination.z, Math.PI * 2) > Math.PI)
        //     ? dt * spd2
        //     : dt * (-spd2);
    }



	c_location.x += (camera.movementVelocity.xvel * dt);
    c_location.y += (camera.movementVelocity.yvel * dt);
    c_location.z += (camera.movementVelocity.zvel * dt);

    c_rotation.x += camera.rotationalVelocity.xvel;
    c_rotation.z += camera.rotationalVelocity.zvel;
    c_rotation.y += camera.rotationalVelocity.yvel % (Math.PI * 2);
    if (Math.abs(c_rotation.y) > Math.PI * 2) c_rotation.y = mod(c_rotation.y, Math.PI * 2)
    if (Math.abs(c_rotation.x) > Math.PI / 2) c_rotation.x = Math.max( Math.min(c_rotation.x, Math.PI/2), -Math.PI/2);

	ApplyFriction(camera.movementVelocity, camera.friction, dt);
    ApplyFriction(camera.rotationalVelocity, camera.friction, dt);
}

const ApplyFriction = (vector: IVelocity, friction: number, dt: number) => {
    vector.xvel *= GetFriction(friction, dt);
    vector.yvel *= GetFriction(friction, dt);
    vector.zvel *= GetFriction(friction, dt);
}

const GetFriction = (friction: number, dt: number) => (dt*friction)