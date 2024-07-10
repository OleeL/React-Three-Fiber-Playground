import React, { FC, useMemo } from 'react';
import {
	PlaneGeometry,
	BufferGeometry,
	Color,
	Material,
	Mesh,
	NormalBufferAttributes,
	Object3DEventMap,
	TextureLoader,
	RepeatWrapping,
} from 'three';
import { useLoader } from '@react-three/fiber';
import { noise } from './perlin';
import { ISmallVector2, useStore } from '../../stores/Store';

const specular = new Color('black');
const sessionSeed = Math.random();

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const RENDER_DISTANCE = 59; // Should be 2n - 1

interface ITerrainData {
	chunkSize: number;
	chunk: ISmallVector2;
	noiseHeight: number;
	noiseFrequency: number;
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
	noiseHeight: number,
	noiseFrequency: number,
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
			// Calculate noise coordinates
			const nx = (i + x) / noiseFrequency;
			const ny = (j + y) / noiseFrequency;

			// Update the z-position of the vertex using noise functions
			pa[3 * (j * wVerts + i) + 2] =
				((noise.simplex2(nx, ny) + // First noise layer
					noise.simplex2((nx + 2) / 0.5, (ny + 2) / 0.5) * ex ** 1 + // Second noise layer
					noise.simplex2((nx + 4) / 0.25, (ny + 4) / 0.25) * ex ** 2 + // Third noise layer
					noise.simplex2((nx + 6) / 0.125, (ny + 6) / 0.125) * ex ** 3 + // Fourth noise layer
					noise.simplex2((nx + 8) / 0.0625, (ny + 8) / 0.0625) * ex ** 4) / // Fifth noise layer
					1.5) *
				noiseHeight; // Normalize the sum of noise layers and scale by noiseHeight
		}
	}

	pos.needsUpdate = true;
};

const Chunk: FC<ITerrainData> = ({
	chunk,
	chunkSize,
	noiseHeight,
	noiseFrequency,
}) => {
	const [ambientOcclusion, baseColor, height, normal, roughness] = useLoader(
		TextureLoader,
		[
			'assets/grass/Stylized_Grass_003_ambientOcclusion.jpg',
			'assets/grass/Stylized_Grass_003_basecolor.jpg',
			'assets/grass/Stylized_Grass_003_height.png',
			'assets/grass/Stylized_Grass_003_normal.jpg',
			'assets/grass/Stylized_Grass_003_roughness.jpg',
		],
	);

	// Ensure textures repeat for the whole terrain
	[ambientOcclusion, baseColor, height, normal, roughness].forEach(texture => {
		texture.wrapS = RepeatWrapping;
		texture.wrapT = RepeatWrapping;
		texture.repeat.set(chunkSize, chunkSize);
	});

	return (
		<mesh
			onUpdate={e =>
				DidUpdate(e, chunk, chunkSize, noiseHeight, noiseFrequency)
			}
			rotation={[-Math.PI * 0.5, 0, 0]}
			position={[chunk.x * chunkSize, -1.5, chunk.y * chunkSize]}
			castShadow
			frustumCulled={false}
			receiveShadow>
			<planeGeometry
				attach="geometry"
				args={[chunkSize, chunkSize, chunkSize, chunkSize]}
			/>
			<meshStandardMaterial
				attach="material"
				map={baseColor}
				aoMap={ambientOcclusion}
				displacementMap={height}
				displacementScale={1}
				normalMap={normal}
				roughnessMap={roughness}
				roughness={1}
				metalness={0}
			/>
		</mesh>
	);
};

noise.seed(sessionSeed);

const Terrain = () => {
	const { chunk, chunkSize, noiseHeight, noiseFrequency } = useStore(state => ({
		chunk: state.chunk,
		chunkSize: state.chunkSize,
		noiseHeight: state.terrain.noiseHeight || 1,
		noiseFrequency: state.terrain.noiseFrequency || 100,
	}));

	const chunkPositions: ISmallVector2[] = useMemo(() => {
		const renderSize = RENDER_DISTANCE * RENDER_DISTANCE;
		const chunkPositions = new Array(renderSize);
		const halfRenderDistance = Math.floor(RENDER_DISTANCE * 0.5);
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
				<Chunk
					key={key}
					chunk={chunkPos}
					chunkSize={chunkSize}
					noiseHeight={noiseHeight}
					noiseFrequency={noiseFrequency}
				/>
			))}
		</group>
	);
};

export default Terrain;
