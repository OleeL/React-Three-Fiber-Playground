import {
    LEFT,
    UP,
    RIGHT,
    DOWN,
    CODELEFT,
    CODEUP,
    CODERIGHT,
    CODEDOWN,
    Q,
    E,
    CODEE,
    CODEQ
} from "./KeyBindingConfig";

import { useFrame, useThree } from "react-three-fiber";
import { useRef } from "react";
import { useStore } from "../../../stores/StoreContext";
import {
    CommandRight,
    CommandDown,
    CommandUp,
    CommandLeft,
    CommandE,
    CommandQ
} from "./KeyBindingCommands";
import { LockPointer } from "./PointerLockControls";

const codeToKey = new Map<number, string>();
const keysDown: string[] = [];


const RegisterKeyBinds = () => {

    CODELEFT.forEach(key => codeToKey.set(key, LEFT));
    CODEUP.forEach(key => codeToKey.set(key, UP));
    CODERIGHT.forEach(key => codeToKey.set(key, RIGHT));
    CODEDOWN.forEach(key => codeToKey.set(key, DOWN));
    CODEE.forEach(key => codeToKey.set(key, E));
    CODEQ.forEach(key => codeToKey.set(key, Q));
}

const onDocumentKeyDown = (event: { which: number; }) => {
    const keyCode: number = event.which;
    if (!codeToKey.has(keyCode)) return;
    const key = codeToKey.get(keyCode);
    if (keysDown.includes(key)) return;
    keysDown.push(key);

};

const onDocumentKeyUp = (event: { which: number; }) => {
    const keyCode: number = event.which;
    // console.log(keyCode);

    if (!codeToKey.has(keyCode)) return;
    keysDown.splice(keysDown.indexOf(codeToKey.get(keyCode)), 1);
};

export const ControlUpdate = () => {
    const ref = useRef();
    const store = useStore();
    useFrame(() => {
        keysDown.forEach(key => {
            switch (key) {
                case LEFT: CommandLeft(store); return;
                case UP: CommandUp(store); return;
                case DOWN: CommandDown(store); return;
                case RIGHT: CommandRight(store); return;
                case E: CommandE(store); return;
                case Q: CommandQ(store); return;
            }
        });
    });
    return <mesh ref={ref} />
}

const Controls = () => {
    const store = useStore();
    RegisterKeyBinds();
    
    if (typeof window === "undefined" || typeof document === "undefined") return;
    window.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("keyup",   onDocumentKeyUp,   false);
    store.camera.camera.rotation.order = "YXZ"; // this is not the default

    LockPointer(store);
}

export default Controls;