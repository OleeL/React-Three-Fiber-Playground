import { useRef } from "react";
import { useThree, Camera } from "react-three-fiber";
import { useStore } from "../../../stores/StoreContext";
import { TStore } from "../../../stores/Store";



export const LockPointer = (store: TStore) => {
    const camera = useThree().camera;

    // check pointerLock support
    let havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    // element for pointerLock

    let requestedElement = document.getElementById("Canvas");

    // prefixes
    requestedElement.requestPointerLock = requestedElement.requestPointerLock

    document.exitPointerLock = document.exitPointerLock

    let isLocked = () => {
        return requestedElement === document.pointerLockElement
    }

    requestedElement.addEventListener('click', () => {
        if (!isLocked()) {
            requestedElement.requestPointerLock();
        }
    }, false);

    let changeCallback = () => {
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
    
    let scale = 1;
    let mouseX = 0;
    let mouseY = 0;

    let moveCallback = (e) => {
        let x = e.movementX;

        let y = e.movementY;


        // console.log(camera);

        
        mouseX = - (x / window.innerWidth) ;
        mouseY = - (y / window.innerHeight);
        
        console.log(mouseX);
        console.log(mouseY);

        store.camera.rotation.y += mouseX;
        store.camera.rotation.x += mouseY;

        document.addEventListener("click", function (e) {
        });
    }
}


