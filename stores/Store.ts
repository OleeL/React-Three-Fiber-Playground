
import {observable} from 'mobx';
import { Vector3, Camera, PerspectiveCamera, Mesh, Euler, Clock, Vector2 } from 'three';
import { useRef } from 'react';
import { IEntry } from '../components/game/Stats';

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
    sensitivity: Vector2,
    direction: number
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
            speed: 2000,
            movementSpeed: 4000,
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
            sensitivity: new Vector2(0.2, 0.15),
            direction: 0
        } as ICamera,

        setCamera: (camera) => {
            store.camera = camera;
        },

        stats: [] as IEntry[],
        addStats: (entry: IEntry) => {
            const search = store.stats.find(s => s.name === entry.name);
            if (search) {
                search.value = entry.value;
                return;
            }
            store.stats.push(entry);
        },

        setStats: (stats) => store.stats = stats
    });    
    return store;
};

export type TStore = ReturnType<typeof createStore>;
