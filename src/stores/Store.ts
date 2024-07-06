import { create } from 'zustand';
import {
	Vector3,
	PerspectiveCamera,
	Mesh,
	Clock,
	Vector2,
	Quaternion,
	Group,
	BufferGeometry,
	Material,
	NormalBufferAttributes,
	Object3DEventMap,
} from 'three';

export interface IEntry {
	name: string;
	value: string;
}

export interface IPlayer {
	position: Vector3;
	direction: number;
	playerMesh: Mesh;
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

export type GameStore = {
	clock: Clock;
	chunkSize: number;
	chunk: ISmallVector2;
	terrain: {
		noiseHeight: number;
		noiseFrequency: number;
	};
	setChunk: (position: ISmallVector2) => void;
	player: IPlayer;
	camera: ICamera;
	setCamera: (c: ICamera) => void;
	showStats: boolean;
	toggleShowStats: () => void;
	stats: IEntry[];
	addStats: (entries: IEntry[]) => void;
	setStats: (stats: IEntry[]) => void;
};

export const useStore = create<GameStore>(set => ({
	clock: new Clock(),

	chunkSize: 10,

	chunk: {
		x: 0,
		y: 0,
	} satisfies ISmallVector2,

	setChunk: ({ x, y }: ISmallVector2) => set({ chunk: { x, y } }),

	player: {
		position: new Vector3(0, 0, 0),
		playerMesh: {} as Mesh<
			BufferGeometry<NormalBufferAttributes>,
			Material | Material[],
			Object3DEventMap
		>,
		direction: 0,
		group: new Group(),
	} satisfies IPlayer,

	terrain: {
		noiseHeight: 3,
		noiseFrequency: 200,
	},

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
		} satisfies IVelocity,
		sensitivity: new Vector2(2, 1.5),
		direction: 0,
	} satisfies ICamera,
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
