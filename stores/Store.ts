
import {observable} from 'mobx';
import { Vector3, Camera, PerspectiveCamera, Mesh } from 'three';
import { useRef } from 'react';

interface IPlayer {
    position: Vector3
}

interface ICamera {
    position: Vector3
}

const camera = new PerspectiveCamera() as PerspectiveCamera

export const createStore = () => {
    const store = observable({
        CAMERASPEED: 0.08,
        player: {} as Mesh,
        setPlayer: (player) => {
            store.player = player;
        },
        camera: new PerspectiveCamera,
        setCamera: (camera) => {
            store.camera = camera;
        }
    });    
    return store;
};

export type TStore = ReturnType<typeof createStore>;
