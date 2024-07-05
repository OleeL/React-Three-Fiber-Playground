import React, { FC, useMemo } from 'react';
import {
	PlaneGeometry,
	BufferGeometry,
	Color,
	Material,
	Mesh,
	NormalBufferAttributes,
	Object3DEventMap,
} from 'three';
import { noise } from './perlin';
import { ISmallVector2, useStore } from '../../stores/Store';

const specular = new Color('black');
const sessionSeed = Math.random();

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const renderDistance = 59; // Should be 2n - 1

interface ITerrainData {
	chunkSize: number;
	chunk: ISmallVector2;
}

const isPlaneMesh = (e: BufferGeometry): e is PlaneGeometry =>
	e?.type === 'PlaneGeometry';

const DidUpdate = (
	e: Mesh<
		BufferGeometry<NormalBufferAttributes>,
		Material | Material[],
		Object3DEventMap
	>,
	chunk: ISmallVector2,
	chunkSize: number,
) => {
	const { geometry } = e;
	const pos = geometry.getAttribute('position');
	const pa = pos.array;
	if (!isPlaneMesh(geometry)) {
		return;
	}

	const hVerts = geometry.parameters.heightSegments + 1;
	const wVerts = geometry.parameters.widthSegments + 1;
	const x = chunk.x * chunkSize;
	const y = chunk.y * chunkSize;
	const ex = 1.1;

	for (let j = 0; j < hVerts; j++) {
		for (let i = 0; i < wVerts; i++) {
			const nx = (i + x) / 100;
			const ny = (j + y) / 100;
			pa[3 * (j * wVerts + i) + 2] =
				(noise.simplex2(nx, ny) +
					noise.simplex2((nx + 2) / 0.5, (ny + 2) / 0.5) * ex ** 1 +
					noise.simplex2((nx + 4) / 0.25, (ny + 4) / 0.25) * ex ** 2 +
					noise.simplex2((nx + 6) / 0.125, (ny + 6) / 0.125) * ex ** 3 +
					noise.simplex2((nx + 8) / 0.0625, (ny + 8) / 0.0625) * ex ** 4) /
				1.5;
		}
	}

	pos.needsUpdate = true;
};

const Chunk: FC<ITerrainData> = ({ chunk, chunkSize }) => {
	return (
		<mesh
			onUpdate={e => DidUpdate(e, chunk, chunkSize)}
			rotation={[-Math.PI / 2, 0, 0]}
			position={[chunk.x * chunkSize, -1.5, chunk.y * chunkSize]}>
			<planeBufferGeometry
				attach="geometry"
				args={[chunkSize, chunkSize, chunkSize, chunkSize]}
			/>
			<meshPhongMaterial
				attach="material"
				color={'white'}
				specular={specular}
				shininess={0}
				// @ts-ignore
				smoothShading
			/>
		</mesh>
	);
};

noise.seed(sessionSeed);

const Terrain = () => {
	const { chunk, chunkSize } = useStore(state => ({
		chunk: state.chunk,
		chunkSize: state.chunkSize,
	}));

	const chunkPositions: ISmallVector2[] = useMemo(() => {
		const renderSize = renderDistance * renderDistance;
		const chunkPositions = new Array(renderSize);
		const halfRenderDistance = Math.floor(renderDistance / 2);
		let index = 0;

		for (
			let x = chunk.x - halfRenderDistance;
			x <= chunk.x + halfRenderDistance;
			x++
		) {
			for (
				let y = chunk.y - halfRenderDistance;
				y <= chunk.y + halfRenderDistance;
				y++
			) {
				chunkPositions[index++] = { x, y };
			}
		}
		return chunkPositions;
	}, [chunk]);

	return (
		<group>
			{chunkPositions.map((chunkPos, key) => (
				<Chunk key={key} chunk={chunkPos} chunkSize={chunkSize} />
			))}
		</group>
	);
};

export default Terrain;
