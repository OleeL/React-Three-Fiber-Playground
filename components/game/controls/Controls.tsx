import { Left, Up, Right, Down } from "./KeyBindings";
import { 
    LEFT,
    UP,
    RIGHT,
    DOWN,
    CODELEFT,
    CODEUP,
    CODERIGHT,
    CODEDOWN
} from "./KeyBindingConfig";

import { useFrame } from "react-three-fiber";
import { useRef } from "react";

const codeToKey = new Map<number, string>();
const keysDown: string[] = [];


const RegisterKeyBinds = () => {
    
    CODELEFT.forEach(key =>  codeToKey.set(key, LEFT));
    CODEUP.forEach(key =>    codeToKey.set(key, UP));
    CODERIGHT.forEach(key => codeToKey.set(key, RIGHT));
    CODEDOWN.forEach(key =>  codeToKey.set(key, DOWN));
}

const onDocumentKeyDown = (event: { which: number; }) => {
    const keyCode: number = event.which;
    if (!codeToKey.has(keyCode)) return;
    const key = codeToKey.get(keyCode);
    if(keysDown.includes(key)) return;
    keysDown.push(key);
    
};

const onDocumentKeyUp = (event: { which: number; }) => {
    
    const keyCode: number = event.which;
    if (!codeToKey.has(keyCode)) return;
    keysDown.splice(keysDown.indexOf(codeToKey.get(keyCode)), 1);
};

export const ControlUpdate = () => {
    const ref = useRef();
    useFrame(() => {
        keysDown.forEach(key => {
            switch(key) {
                case LEFT: Left(); return;
                case UP: Up(); return;
                case DOWN: Down(); return;
                case RIGHT: Right(); return;
            }
        });
    });
    return <mesh ref={ref}/>
}

const Controls = () =>  {
    RegisterKeyBinds();
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("keyup",   onDocumentKeyUp,   false);
}

export default Controls;