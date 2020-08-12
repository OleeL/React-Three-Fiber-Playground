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
import {
    CommandRight,
    CommandDown,
    CommandUp,
    CommandLeft,
    CommandE,
    CommandQ
} from "./KeyBindingCommands";
import { LockPointer } from "./PointerLockControls";
import { _store } from "../../../stores/Store";

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

export const LoopControls = (dt: number, player, camera) => {    
    keysDown.forEach(key => {
        switch (key) {
            case LEFT: CommandLeft(player, camera, dt); return;
            case UP: CommandUp(player, camera, dt); return;
            case DOWN: CommandDown(player, camera, dt); return;
            case RIGHT: CommandRight(player, camera, dt); return;
            case E: CommandE(player, camera, dt); return;
            case Q: CommandQ(player, camera, dt); return;
        }
    });
}

const CreateControls = () => {
    RegisterKeyBinds();
    if (typeof window === "undefined" || typeof document === "undefined") return;
    window.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("keyup",   onDocumentKeyUp,   false);
    LockPointer();
}

export default CreateControls;