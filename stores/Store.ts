
import {create} from 'zustand';
import { Vector3, PerspectiveCamera, Mesh, Clock, Vector2, Quaternion, Group } from 'three';
import { IEntry } from '../components/game/Statistics';

export interface IPlayer {
    position: Vector3;
    direction: number;
    player: Mesh;
    group: Group;
}

export interface ICamera {
    position: Vector3;
    quaternion: Quaternion;
    camera: PerspectiveCamera;
    distance: number;
    speed: number;
    friction: number;
    movementVelocity: IVelocity;
    rotationalVelocity: IVelocity;
    sensitivity: Vector2;
    direction: number;
}

export interface IVelocity {
    xvel: number;
    yvel: number;
    zvel: number;
}

export interface ISmallVector2 {
    x: number;
    y: number;
}

export const [useStore, _store] = create((set, get) => ({
    clock: new Clock(),

    chunkSize: 25,

    chunk: {
        x: 0,
        y: 0
    } as ISmallVector2,

    setChunk: (x: number, y: number) => set({chunk: {x: x, y: y}}),

    player: {
        position: new Vector3(0,0,0),
        player: {},
        direction: 0,
        group: new Group()
    } as IPlayer,

    camera: {
        camera: new PerspectiveCamera,
        quaternion: new Quaternion(),
        position: new Vector3(0, 1, 4),
        distance: 4,
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
        sensitivity: new Vector2(2, 1.5),
        direction: 0
    } as ICamera,

    setCamera: (c: ICamera) => set(({camera: c})),

    showStats: false,

    toggleShowStats: () => set(s => {s.showStats = !s.showStats}),

    stats: [] as IEntry[],

    addStats: (entries: IEntry[]) => set(() => {
        const newEntries = [...get().stats];
        entries.forEach(entry => {
            const search = newEntries.find(s => s.name === entry.name);
            if (search) {
                search.value = entry.value;
                return;
            }
            newEntries.push(entry);
        })
        return {stats: newEntries};
    }),

    setStats: (stats) => set(({stats: stats}))
}));

export type State = ReturnType<typeof _store.getState>;