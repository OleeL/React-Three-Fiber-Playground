import React, { useMemo } from 'react';
import {
	BufferAttribute,
	BufferGeometry,
	RepeatWrapping,
	SRGBColorSpace,
	TextureLoader,
} from 'three';
import { useLoader } from '@react-three/fiber';
import { noise } from './perlin';
import { ISmallVector2, useStore } from '../../stores/Store';

const sessionSeed = Math.random();

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const RENDER_DISTANCE = 41; // Should be 2n - 1
const SEGMENTS_PER_CHUNK = 4;
const TERRAIN_Y_OFFSET = -1.5;

const getTerrainHeight = (
	x: number,
	y: number,
	noiseHeight: number,
	noiseFrequency: number,
) => {
	const nx = x / noiseFrequency;
	const ny = y / noiseFrequency;
	const ex = 1.1;

	return (
		((noise.simplex2(nx, ny) +
			noise.simplex2((nx + 2) / 0.5, (ny + 2) / 0.5) * ex ** 1 +
			noise.simplex2((nx + 4) / 0.25, (ny + 4) / 0.25) * ex ** 2 +
			noise.simplex2((nx + 6) / 0.125, (ny + 6) / 0.125) * ex ** 3 +
			noise.simplex2((nx + 8) / 0.0625, (ny + 8) / 0.0625) * ex ** 4) /
			1.5) *
		noiseHeight
	);
};

const createTerrainGeometry = (
	chunk: ISmallVector2,
	chunkSize: number,
	noiseHeight: number,
	noiseFrequency: number,
) => {
	const halfRenderDistance = Math.floor(RENDER_DISTANCE * 0.5);
	const minChunkX = chunk.x - halfRenderDistance;
	const minChunkY = chunk.y - halfRenderDistance;
	const worldMinX = minChunkX * chunkSize;
	const worldMinZ = minChunkY * chunkSize;
	const segments = RENDER_DISTANCE * SEGMENTS_PER_CHUNK;
	const vertexCount = (segments + 1) * (segments + 1);
	const terrainSize = RENDER_DISTANCE * chunkSize;
	const step = terrainSize / segments;
	const positions = new Float32Array(vertexCount * 3);
	const uvs = new Float32Array(vertexCount * 2);
	const indices = new Uint32Array(segments * segments * 6);
	let positionIndex = 0;
	let uvIndex = 0;

	for (let z = 0; z <= segments; z++) {
		for (let x = 0; x <= segments; x++) {
			const worldX = worldMinX + x * step;
			const worldZ = worldMinZ + z * step;
			positions[positionIndex++] = worldX;
			positions[positionIndex++] =
				getTerrainHeight(worldX, worldZ, noiseHeight, noiseFrequency) +
				TERRAIN_Y_OFFSET;
			positions[positionIndex++] = worldZ;
			uvs[uvIndex++] = worldX;
			uvs[uvIndex++] = worldZ;
		}
	}

	let index = 0;
	for (let z = 0; z < segments; z++) {
		for (let x = 0; x < segments; x++) {
			const topLeft = z * (segments + 1) + x;
			const topRight = topLeft + 1;
			const bottomLeft = (z + 1) * (segments + 1) + x;
			const bottomRight = bottomLeft + 1;

			indices[index++] = topLeft;
			indices[index++] = bottomLeft;
			indices[index++] = topRight;
			indices[index++] = topRight;
			indices[index++] = bottomLeft;
			indices[index++] = bottomRight;
		}
	}

	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
	geometry.setAttribute('uv2', new BufferAttribute(uvs, 2));
	geometry.setIndex(new BufferAttribute(indices, 1));
	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();

	return geometry;
};

noise.seed(sessionSeed);

const Terrain = () => {
	const { chunk, chunkSize, noiseHeight, noiseFrequency } = useStore(state => ({
		chunk: state.chunk,
		chunkSize: state.chunkSize,
		noiseHeight: state.terrain.noiseHeight || 1,
		noiseFrequency: state.terrain.noiseFrequency || 100,
	}));
	const [ambientOcclusion, baseColor, normal, roughness] = useLoader(
		TextureLoader,
		[
			'assets/grass/Stylized_Grass_003_ambientOcclusion.jpg',
			'assets/grass/Stylized_Grass_003_basecolor.jpg',
			'assets/grass/Stylized_Grass_003_normal.jpg',
			'assets/grass/Stylized_Grass_003_roughness.jpg',
		],
	);
	const geometry = useMemo(
		() => createTerrainGeometry(chunk, chunkSize, noiseHeight, noiseFrequency),
		[chunk, chunkSize, noiseHeight, noiseFrequency],
	);

	baseColor.colorSpace = SRGBColorSpace;
	[ambientOcclusion, baseColor, normal, roughness].forEach(texture => {
		texture.wrapS = RepeatWrapping;
		texture.wrapT = RepeatWrapping;
	});

	return (
		<mesh geometry={geometry} frustumCulled={false} receiveShadow>
			<meshStandardMaterial
				attach="material"
				map={baseColor}
				aoMap={ambientOcclusion}
				normalMap={normal}
				roughnessMap={roughness}
				roughness={1}
				metalness={0}
			/>
		</mesh>
	);
};

export default Terrain;
