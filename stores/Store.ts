
import {create} from 'zustand';
import { Vector3, Camera, PerspectiveCamera, Mesh, Euler, Clock, Vector2 } from 'three';
import { useRef } from 'react';
import { IEntry } from '../components/game/Statistics';

export interface IPlayer {
    position: Vector3,
    direction: number,
    player: Mesh
}

export interface ICamera {
    position: Vector3,
    rotation: Euler,
    camera: PerspectiveCamera,
    speed: number,
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

export const [useStore, _store] = create((set, get) => ({
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
        speed: 10000,
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
        sensitivity: new Vector2(3, 2.5),
        direction: 0
    } as ICamera,

    setCamera: (c: ICamera) => set(({camera: c})),

    stats: [] as IEntry[],
    addStats: (entry: IEntry) => set(() => {
        const search = get().stats.find(s => s.name === entry.name);
        if (search) {
            search.value = entry.value;
            return;
        }
        get().stats.push(entry);
    }),

    setStats: (stats) => set(({stats: stats}))
}));

export type State = ReturnType<typeof _store.getState>;