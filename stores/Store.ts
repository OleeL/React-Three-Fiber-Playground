
import {observable} from 'mobx';
import { Vector3, Camera, PerspectiveCamera, Mesh, Euler, Clock, Vector2 } from 'three';
import { useRef } from 'react';

interface IPlayer {
    position: Vector3,
    direction: number,
    player: Mesh
}

interface ICamera {
    position: Vector3,
    rotation: Euler,
    camera: PerspectiveCamera,
    speed: number,
    movementSpeed: number,
    friction: number,
    movementVelocity: IVelocity,
    rotationalVelocity: IVelocity,
    sensitivity: Vector2
}

export interface IVelocity {
    xvel: number,
    yvel: number,
    zvel: number
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
            speed: 20,
            movementSpeed: 20,
            friction: 50,
            movementVelocity: {
                xvel: 0,
                yvel: 0,
                zvel: 0
            } as IVelocity,
            rotationalVelocity: {
                xvel: 0,
                yvel: 0,
                zvel: 0
            } as IVelocity,
            sensitivity: new Vector2(0.2, 0.2)
        } as ICamera,

        setCamera: (camera) => {
            store.camera = camera;
        }
    });    
    return store;
};

export type TStore = ReturnType<typeof createStore>;
