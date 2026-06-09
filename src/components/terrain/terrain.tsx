import React, { useEffect, useMemo, useRef } from 'react';
import {
	BufferAttribute,
	BufferGeometry,
	Color,
	DoubleSide,
	DynamicDrawUsage,
	InstancedMesh,
	Matrix4,
	Mesh,
	Object3D,
	PlaneGeometry,
	ShaderMaterial,
	Vector3,
} from 'three';
import { useFrame } from '@react-three/fiber';
import { noise } from './perlin';
import { ISmallVector2, useStore } from '../../stores/Store';

const sessionSeed = Math.random();

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const RENDER_DISTANCE = 151; // Should be 2n - 1
const SEGMENTS_PER_CHUNK = 2;
const TERRAIN_UPDATE_CHUNKS = 8;
const GRASS_UPDATE_CHUNKS = 5;
const TERRAIN_Y_OFFSET = -2.5;
const SEA_LEVEL = -1.2;
const GRASS_COUNT = 12000;
const GRASS_RADIUS = 340;
const GRASS_CELL_SIZE = 4;
const GRASS_BLADE_WIDTH = 0.09;
const GRASS_BLADE_HEIGHT = 0.48;
const TERRAIN_COLORS = {
	sand: new Color(0xd9c07b),
	grass: new Color(0x78d957),
	rock: new Color(0x7d7d73),
	snow: new Color(0xe6eee8),
};

const reusableDummy = new Object3D();
const reusablePosition = new Vector3();
const reusableScale = new Vector3();
const reusableMatrix = new Matrix4();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (edge0: number, edge1: number, value: number) => {
	const t = clamp01((value - edge0) / (edge1 - edge0));
	return t * t * (3 - 2 * t);
};

const random2 = (x: number, z: number) => {
	const value =
		Math.sin(x * 127.1 + z * 311.7 + sessionSeed * 101.3) * 43758.5453;
	return value - Math.floor(value);
};

export const getTerrainHeight = (
	x: number,
	z: number,
	noiseHeight: number,
	noiseFrequency: number,
) => {
	const continent = noise.simplex2(x / 850, z / 850) * 0.5 + 0.5;
	const mountainMask = smoothstep(0.52, 0.92, continent);
	const rollingHills =
		noise.simplex2(x / noiseFrequency, z / noiseFrequency) * noiseHeight * 2.2;
	const foothills = noise.simplex2((x + 400) / 140, (z - 200) / 140) * 7;
	const ridges = Math.abs(noise.simplex2((x - 250) / 220, (z + 300) / 220));
	const mountainRidges = (1 - ridges) ** 2.35 * 42 * mountainMask;
	const peaks =
		(noise.simplex2((x + 900) / 380, (z - 700) / 380) * 0.5 + 0.5) ** 4 *
		34 *
		mountainMask;
	const lakeBasins =
		(noise.simplex2((x - 120) / 520, (z + 80) / 520) * 0.5 + 0.5) ** 3 * -8;

	return (
		rollingHills +
		foothills * mountainMask +
		mountainRidges +
		peaks +
		lakeBasins +
		TERRAIN_Y_OFFSET
	);
};

const getTerrainColor = (height: number, slope: number) => {
	const color = TERRAIN_COLORS.grass.clone();

	if (height < SEA_LEVEL + 0.45) {
		return color
			.copy(TERRAIN_COLORS.sand)
			.lerp(
				TERRAIN_COLORS.grass,
				smoothstep(SEA_LEVEL - 0.2, SEA_LEVEL + 0.9, height),
			);
	}

	if (height > 48) {
		return color
			.copy(TERRAIN_COLORS.rock)
			.lerp(TERRAIN_COLORS.snow, smoothstep(48, 68, height));
	}

	if (height > 28 || slope > 0.48) {
		return color
			.copy(TERRAIN_COLORS.grass)
			.lerp(
				TERRAIN_COLORS.rock,
				Math.max(smoothstep(0.35, 0.85, slope), smoothstep(22, 42, height)),
			);
	}

	return color;
};

const quantizeChunk = (value: number, chunkStep: number) =>
	Math.round(value / chunkStep) * chunkStep;

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
	const colors = new Float32Array(vertexCount * 3);
	const heights = new Float32Array(vertexCount);
	const indices = new Uint32Array(segments * segments * 6);
	let positionIndex = 0;
	let heightIndex = 0;

	for (let z = 0; z <= segments; z++) {
		for (let x = 0; x <= segments; x++) {
			const worldX = worldMinX + x * step;
			const worldZ = worldMinZ + z * step;
			const height = getTerrainHeight(
				worldX,
				worldZ,
				noiseHeight,
				noiseFrequency,
			);

			heights[heightIndex++] = height;
			positions[positionIndex++] = worldX;
			positions[positionIndex++] = height;
			positions[positionIndex++] = worldZ;
		}
	}

	let colorIndex = 0;
	for (let z = 0; z <= segments; z++) {
		for (let x = 0; x <= segments; x++) {
			const vertexIndex = z * (segments + 1) + x;
			const left = heights[z * (segments + 1) + Math.max(0, x - 1)];
			const right = heights[z * (segments + 1) + Math.min(segments, x + 1)];
			const down = heights[Math.max(0, z - 1) * (segments + 1) + x];
			const up = heights[Math.min(segments, z + 1) * (segments + 1) + x];
			const slope =
				Math.sqrt((right - left) ** 2 + (up - down) ** 2) / (step * 2);
			const worldX = positions[vertexIndex * 3];
			const worldZ = positions[vertexIndex * 3 + 2];
			const color = getTerrainColor(heights[vertexIndex], slope);
			const variation = lerp(0.88, 1.12, random2(worldX, worldZ));

			colors[colorIndex++] = color.r * variation;
			colors[colorIndex++] = color.g * variation;
			colors[colorIndex++] = color.b * variation;
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
	geometry.setAttribute('color', new BufferAttribute(colors, 3));
	geometry.setIndex(new BufferAttribute(indices, 1));
	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();

	return geometry;
};

const waterMaterial = new ShaderMaterial({
	transparent: true,
	depthWrite: false,
	uniforms: {
		time: { value: 0 },
		waterColor: { value: new Color(0x6bd8ee) },
		deepColor: { value: new Color(0x2b93b8) },
	},
	vertexShader: `
		uniform float time;
		varying vec2 vWorldXZ;
		varying float vWave;

		void main() {
			vec4 worldPosition = modelMatrix * vec4(position, 1.0);
			vec3 transformed = position;
			float wave = sin(worldPosition.x * 0.025 + time * 0.8) * 0.18 + cos(worldPosition.z * 0.032 + time * 1.1) * 0.12;
			transformed.z += wave;
			vWorldXZ = worldPosition.xz;
			vWave = wave;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
		}
	`,
	fragmentShader: `
		uniform vec3 waterColor;
		uniform vec3 deepColor;
		varying vec2 vWorldXZ;
		varying float vWave;

		void main() {
			float shimmer = sin((vWorldXZ.x + vWorldXZ.y) * 0.12 + vWave * 5.0) * 0.5 + 0.5;
			vec3 color = mix(deepColor, waterColor, 0.72 + shimmer * 0.14);
			gl_FragColor = vec4(color, 0.62);
		}
	`,
});

const grassMaterial = new ShaderMaterial({
	side: DoubleSide,
	transparent: true,
	uniforms: {
		time: { value: 0 },
		grassBase: { value: new Color(0x4fb63b) },
		grassTip: { value: new Color(0xc8ff74) },
	},
	vertexShader: `
		uniform float time;
		varying vec2 vUv;

		void main() {
			vUv = uv;
			vec3 transformed = position;
			vec4 instanceWorld = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
			float sway = sin(time * 2.0 + instanceWorld.x * 0.07 + instanceWorld.z * 0.05) * 0.08;
			transformed.x += sway * uv.y * uv.y;
			gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
		}
	`,
	fragmentShader: `
		uniform vec3 grassBase;
		uniform vec3 grassTip;
		varying vec2 vUv;

		void main() {
			float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
			vec3 color = mix(grassBase, grassTip, vUv.y);
			gl_FragColor = vec4(color, edgeFade * 0.95);
		}
	`,
});

noise.seed(sessionSeed);

const Water = ({
	chunk,
	chunkSize,
}: {
	chunk: ISmallVector2;
	chunkSize: number;
}) => {
	const meshRef = useRef<Mesh>(null);
	const geometry = useMemo(
		() =>
			new PlaneGeometry(
				RENDER_DISTANCE * chunkSize * 1.15,
				RENDER_DISTANCE * chunkSize * 1.15,
				64,
				64,
			),
		[chunkSize],
	);

	useFrame(({ clock }) => {
		waterMaterial.uniforms.time.value = clock.elapsedTime;
	});

	return (
		<mesh
			ref={meshRef}
			geometry={geometry}
			material={waterMaterial}
			position={[chunk.x * chunkSize, SEA_LEVEL, chunk.y * chunkSize]}
			rotation={[-Math.PI * 0.5, 0, 0]}
			frustumCulled={false}
		/>
	);
};

const WavyGrass = ({
	chunk,
	chunkSize,
	noiseHeight,
	noiseFrequency,
}: {
	chunk: ISmallVector2;
	chunkSize: number;
	noiseHeight: number;
	noiseFrequency: number;
}) => {
	const meshRef = useRef<InstancedMesh>(null);
	const bladeGeometry = useMemo(() => {
		const geometry = new PlaneGeometry(
			GRASS_BLADE_WIDTH,
			GRASS_BLADE_HEIGHT,
			1,
			3,
		);
		geometry.translate(0, GRASS_BLADE_HEIGHT * 0.5, 0);
		return geometry;
	}, []);

	useEffect(() => {
		const mesh = meshRef.current;
		if (!mesh) return undefined;

		let visibleCount = 0;
		const centerX = chunk.x * chunkSize;
		const centerZ = chunk.y * chunkSize;
		const radiusSquared = GRASS_RADIUS * GRASS_RADIUS;
		const minCellX = Math.floor((centerX - GRASS_RADIUS) / GRASS_CELL_SIZE);
		const maxCellX = Math.ceil((centerX + GRASS_RADIUS) / GRASS_CELL_SIZE);
		const minCellZ = Math.floor((centerZ - GRASS_RADIUS) / GRASS_CELL_SIZE);
		const maxCellZ = Math.ceil((centerZ + GRASS_RADIUS) / GRASS_CELL_SIZE);

		for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
			for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
				if (visibleCount >= GRASS_COUNT) break;

				const jitterX = random2(cellX, cellZ) - 0.5;
				const jitterZ = random2(cellX + 19.17, cellZ - 4.83) - 0.5;
				const x = (cellX + 0.5 + jitterX * 0.7) * GRASS_CELL_SIZE;
				const z = (cellZ + 0.5 + jitterZ * 0.7) * GRASS_CELL_SIZE;
				const distanceX = x - centerX;
				const distanceZ = z - centerZ;

				if (distanceX * distanceX + distanceZ * distanceZ > radiusSquared)
					continue;
				if (random2(cellX - 8.4, cellZ + 5.2) < 0.18) continue;

				const height = getTerrainHeight(x, z, noiseHeight, noiseFrequency);

				if (height < SEA_LEVEL + 0.75 || height > 26) continue;

				reusableDummy.position.set(x, height + 0.025, z);
				reusableDummy.rotation.set(0, random2(x, z) * Math.PI, 0);
				const scale = lerp(0.65, 1.05, random2(z, x));
				reusableDummy.scale.setScalar(scale);
				reusableDummy.updateMatrix();
				mesh.setMatrixAt(visibleCount, reusableDummy.matrix);
				visibleCount += 1;
			}
		}

		for (let i = visibleCount; i < GRASS_COUNT; i++) {
			reusablePosition.set(0, -10000, 0);
			reusableScale.set(0.001, 0.001, 0.001);
			reusableMatrix.compose(
				reusablePosition,
				reusableDummy.quaternion,
				reusableScale,
			);
			mesh.setMatrixAt(i, reusableMatrix);
		}

		mesh.instanceMatrix.needsUpdate = true;
		mesh.instanceMatrix.setUsage(DynamicDrawUsage);

		return undefined;
	}, [chunk, chunkSize, noiseHeight, noiseFrequency]);

	useFrame(({ clock }) => {
		grassMaterial.uniforms.time.value = clock.elapsedTime;
	});

	return (
		<instancedMesh
			ref={meshRef}
			args={[bladeGeometry, grassMaterial, GRASS_COUNT]}
			frustumCulled={false}
		/>
	);
};

const Terrain = () => {
	const { chunk, chunkSize, noiseHeight, noiseFrequency } = useStore(state => ({
		chunk: state.chunk,
		chunkSize: state.chunkSize,
		noiseHeight: state.terrain.noiseHeight || 1,
		noiseFrequency: state.terrain.noiseFrequency || 100,
	}));
	const terrainChunkX = quantizeChunk(chunk.x, TERRAIN_UPDATE_CHUNKS);
	const terrainChunkY = quantizeChunk(chunk.y, TERRAIN_UPDATE_CHUNKS);
	const grassChunkX = quantizeChunk(chunk.x, GRASS_UPDATE_CHUNKS);
	const grassChunkY = quantizeChunk(chunk.y, GRASS_UPDATE_CHUNKS);
	const terrainChunk = useMemo(
		() => ({ x: terrainChunkX, y: terrainChunkY }),
		[terrainChunkX, terrainChunkY],
	);
	const grassChunk = useMemo(
		() => ({ x: grassChunkX, y: grassChunkY }),
		[grassChunkX, grassChunkY],
	);
	const geometry = useMemo(
		() =>
			createTerrainGeometry(
				terrainChunk,
				chunkSize,
				noiseHeight,
				noiseFrequency,
			),
		[terrainChunk, chunkSize, noiseHeight, noiseFrequency],
	);

	useEffect(
		() => () => {
			geometry.dispose();
		},
		[geometry],
	);

	return (
		<>
			<mesh geometry={geometry} frustumCulled={false} receiveShadow>
				<meshStandardMaterial
					attach="material"
					vertexColors
					color={0xffffff}
					roughness={0.95}
					metalness={0}
				/>
			</mesh>
			<Water chunk={chunk} chunkSize={chunkSize} />
			<WavyGrass
				chunk={grassChunk}
				chunkSize={chunkSize}
				noiseHeight={noiseHeight}
				noiseFrequency={noiseFrequency}
			/>
		</>
	);
};

export default Terrain;
