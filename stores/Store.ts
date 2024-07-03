import { create } from 'zustand';
import {
	Vector3,
	PerspectiveCamera,
	Mesh,
	Clock,
	Vector2,
	Quaternion,
	Group,
} from 'three';

export interface IEntry {
	name: string;
	value: string;
}

export interface IPlayer {
	position: Vector3;
	direction: number;
	player: Mesh;
	group: Group;
}

export interface IVelocity {
	xvel: number;
	yvel: number;
	zvel: number;
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

export interface ISmallVector2 {
	x: number;
	y: number;
}

export type TStore = {
	clock: Clock;
	chunkSize: number;
	chunk: ISmallVector2;
	setChunk: (x: number, y: number) => void;
	player: IPlayer;
	camera: ICamera;
	setCamera: (c: ICamera) => void;
	showStats: boolean;
	toggleShowStats: () => void;
	stats: IEntry[];
	addStats: (entries: IEntry[]) => void;
	setStats: (stats: IEntry[]) => void;
};

export const useStore = create<TStore>(set => ({
	clock: new Clock(),

	chunkSize: 25,

	chunk: {
		x: 0,
		y: 0,
	} as ISmallVector2,

	setChunk: (x: number, y: number) => set({ chunk: { x, y } }),

	player: {
		position: new Vector3(0, 0, 0),
		player: {},
		direction: 0,
		group: new Group(),
	} as IPlayer,

	camera: {
		camera: new PerspectiveCamera(),
		quaternion: new Quaternion(),
		position: new Vector3(0, 1, 4),
		distance: 4,
		speed: 10000,
		friction: 50,
		movementVelocity: {
			xvel: 0,
			yvel: 0,
			zvel: 0,
		} as IVelocity,
		rotationalVelocity: {
			xvel: 0,
			yvel: 0,
			zvel: 0,
		} as IVelocity,
		sensitivity: new Vector2(2, 1.5),
		direction: 0,
	} as ICamera,
	setCamera: (c: ICamera) => set({ camera: c }),
	showStats: false,
	toggleShowStats: () => set(s => ({ showStats: !s.showStats })),
	stats: [] as IEntry[],
	addStats: (entries: IEntry[]) =>
		set(s => {
			const newEntries = [...s.stats];
			entries.forEach(entry => {
				const search = newEntries.find(s => s.name === entry.name);
				if (search) {
					search.value = entry.value;
					return;
				}
				newEntries.push(entry);
			});
			return { stats: newEntries };
		}),

	setStats: (stats: IEntry[]) => set({ stats }),
}));
