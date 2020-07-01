
import {observable} from 'mobx';
import { Vector3, Camera, PerspectiveCamera, Mesh, Euler, Clock } from 'three';
import { useRef } from 'react';

interface IPlayer {
    position: Vector3,
    direction: number,
    player: Mesh
}

interface ICamera {
    position: Vector3,
    rotation: Euler,
    camera: PerspectiveCamera
    speed: number
}

export const createStore = () => {
    const store = observable({

        clock: new Clock(),

        player: {
            position: new Vector3(0,0,0),
            player: {},
            direction: 0
        } as IPlayer,

        camera: {
            camera: new PerspectiveCamera,
            rotation: new Euler(-0.349066,0,0),
            position: new Vector3(0, 1, 4),
            speed: 33,
        } as ICamera,

        setCamera: (camera) => {
            store.camera = camera;
        }
    });    
    return store;
};

export type TStore = ReturnType<typeof createStore>;
