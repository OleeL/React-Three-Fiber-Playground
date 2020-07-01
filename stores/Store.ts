
import {observable} from 'mobx';
import { Vector3, Camera, PerspectiveCamera, Mesh, Euler } from 'three';
import { useRef } from 'react';

interface IPlayer {
    position: Vector3,
    direction: number
}

interface ICamera {
    position: Vector3,
    rotation: Euler
    camera: PerspectiveCamera
}

const camera = new PerspectiveCamera() as PerspectiveCamera

export const createStore = () => {
    const store = observable({

        CAMERASPEED: 0.01,

        player: {} as Mesh,

        playerSettings: {
            position: new Vector3(0,0,0),
            direction: 0
        } as IPlayer,

        setPlayer: (player) => {
            store.player = player;
        },

        camera: {
            camera: new PerspectiveCamera,
            rotation: new Euler(-0.349066,0,0),

        } as ICamera,

        setCamera: (camera) => {
            store.camera = camera;
        }
    });    
    return store;
};

export type TStore = ReturnType<typeof createStore>;
