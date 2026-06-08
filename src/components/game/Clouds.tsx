import { FC, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Mesh, ShaderMaterial, Vector3 } from 'three';
import { useStore } from '../../stores/Store';

const vertexShader = `
	varying vec3 vWorldPosition;

	void main() {
		vec4 worldPosition = modelMatrix * vec4(position, 1.0);
		vWorldPosition = worldPosition.xyz;
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`;

const fragmentShader = `
	precision highp float;

	uniform vec3 cameraWorldPosition;
	uniform vec3 boundsMin;
	uniform vec3 boundsMax;
	uniform vec3 sunDirection;
	uniform float time;
	uniform float coverage;
	uniform float densityMultiplier;
	uniform float detailStrength;
	uniform float maxTraceDistance;
	uniform float shadowStrength;
	uniform float insideCloud;
	uniform int steps;

	varying vec3 vWorldPosition;

	float hash(vec3 p) {
		p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
		p *= 17.0;
		return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
	}

	float noise(vec3 p) {
		vec3 i = floor(p);
		vec3 f = fract(p);
		f = f * f * (3.0 - 2.0 * f);

		float n000 = hash(i + vec3(0.0, 0.0, 0.0));
		float n100 = hash(i + vec3(1.0, 0.0, 0.0));
		float n010 = hash(i + vec3(0.0, 1.0, 0.0));
		float n110 = hash(i + vec3(1.0, 1.0, 0.0));
		float n001 = hash(i + vec3(0.0, 0.0, 1.0));
		float n101 = hash(i + vec3(1.0, 0.0, 1.0));
		float n011 = hash(i + vec3(0.0, 1.0, 1.0));
		float n111 = hash(i + vec3(1.0, 1.0, 1.0));

		float nx00 = mix(n000, n100, f.x);
		float nx10 = mix(n010, n110, f.x);
		float nx01 = mix(n001, n101, f.x);
		float nx11 = mix(n011, n111, f.x);
		float nxy0 = mix(nx00, nx10, f.y);
		float nxy1 = mix(nx01, nx11, f.y);
		return mix(nxy0, nxy1, f.z);
	}

	float shapeNoise(vec3 p) {
		return noise(p) * 0.68 + noise(p * 2.03 + 17.1) * 0.32;
	}

	float detailNoise(vec3 p) {
		return noise(p);
	}

	float remap(float value, float originalMin, float originalMax, float newMin, float newMax) {
		return newMin + (value - originalMin) * (newMax - newMin) / (originalMax - originalMin);
	}

	vec2 rayBoxDistance(vec3 boundsMinValue, vec3 boundsMaxValue, vec3 rayOrigin, vec3 invRayDirection) {
		vec3 t0 = (boundsMinValue - rayOrigin) * invRayDirection;
		vec3 t1 = (boundsMaxValue - rayOrigin) * invRayDirection;
		vec3 tMin = min(t0, t1);
		vec3 tMax = max(t0, t1);
		float dstA = max(max(tMin.x, tMin.y), tMin.z);
		float dstB = min(tMax.x, min(tMax.y, tMax.z));
		float dstToBox = max(0.0, dstA);
		float dstInsideBox = max(0.0, dstB - dstToBox);
		return vec2(dstToBox, dstInsideBox);
	}

	float sampleDensity(vec3 position, bool includeDetail) {
		vec3 boundsSize = boundsMax - boundsMin;
		float heightPercent = clamp((position.y - boundsMin.y) / boundsSize.y, 0.0, 1.0);
		float bottomFade = smoothstep(0.0, 0.18, heightPercent);
		float topFade = 1.0 - smoothstep(0.72, 1.0, heightPercent);
		float heightGradient = bottomFade * topFade;
		vec3 wind = vec3(time * 0.008, 0.0, time * 0.0035);
		vec3 shapePosition = position * 0.006 + wind;
		float shape = shapeNoise(shapePosition);
		float cloud = remap(shape, coverage, 1.0, 0.0, 1.0) * heightGradient;

		if (includeDetail && detailStrength > 0.01 && cloud > 0.04) {
			float detail = detailNoise(position * 0.032 + wind * 4.0);
			cloud -= detail * detailStrength * 0.2;
		}

		return clamp(cloud, 0.0, 1.0) * densityMultiplier;
	}

	float interleavedGradientNoise(vec2 pixelPosition) {
		return fract(52.9829189 * fract(0.06711056 * pixelPosition.x + 0.00583715 * pixelPosition.y));
	}

	void main() {
		vec3 rayOrigin = cameraWorldPosition;
		vec3 rayDirection = normalize(vWorldPosition - rayOrigin);
		vec2 hit = rayBoxDistance(boundsMin, boundsMax, rayOrigin, 1.0 / rayDirection);
		float dstToBox = hit.x;
		float dstInsideBox = hit.y;

		if (dstInsideBox <= 0.0) {
			discard;
		}

		dstInsideBox = min(dstInsideBox, maxTraceDistance);
		float stepSize = dstInsideBox / float(steps);
		float dstTravelled = dstToBox + stepSize * interleavedGradientNoise(gl_FragCoord.xy);
		float transmittance = 1.0;
		vec3 cloudColor = vec3(0.0);
		vec3 lightColor = vec3(1.0, 0.95, 0.84);
		vec3 midColor = vec3(0.75, 0.82, 0.90);
		vec3 shadowColor = vec3(0.43, 0.52, 0.64);

		for (int i = 0; i < 24; i++) {
			if (i >= steps) {
				break;
			}

			vec3 samplePosition = rayOrigin + rayDirection * dstTravelled;
			float density = sampleDensity(samplePosition, insideCloud < 0.5);

			if (density > 0.002) {
				float shadowDensity = 0.0;
				if (shadowStrength > 0.01) {
					shadowDensity = sampleDensity(samplePosition + sunDirection * 18.0, false);
				}
				float light = insideCloud > 0.5 ? 0.72 : exp(-shadowDensity * shadowStrength);
				float heightLight = smoothstep(boundsMin.y, boundsMax.y, samplePosition.y);
				vec3 sampleColor = mix(shadowColor, midColor, light);
				sampleColor = mix(sampleColor, lightColor, light * heightLight * 0.65);
				float alpha = 1.0 - exp(-density * stepSize * 0.052);
				cloudColor += sampleColor * alpha * transmittance;
				transmittance *= 1.0 - alpha;

				if (transmittance < 0.035) {
					break;
				}
			}

			dstTravelled += stepSize;
		}

		float alpha = clamp(1.0 - transmittance, 0.0, 0.9);
		if (alpha < 0.01) {
			discard;
		}

		gl_FragColor = vec4(cloudColor, alpha);
	}
`;

const cloudCenter = new Vector3();
const boundsMin = new Vector3();
const boundsMax = new Vector3();
const sunDirection = new Vector3(0.45, 0.78, 0.3).normalize();

const CLOUD_WIDTH = 760;
const CLOUD_BOTTOM = 42;
const CLOUD_TOP = 112;
const CLOUD_HEIGHT = CLOUD_TOP - CLOUD_BOTTOM;
const CLOUD_CENTER_Y = CLOUD_BOTTOM + CLOUD_HEIGHT * 0.5;

const Clouds: FC = () => {
	const meshRef = useRef<Mesh>(null);
	const materialRef = useRef<ShaderMaterial>(null);
	const { player } = useStore.getState();
	const uniforms = useMemo(
		() => ({
			boundsMin: {
				value: new Vector3(
					-CLOUD_WIDTH * 0.5,
					CLOUD_BOTTOM,
					-CLOUD_WIDTH * 0.5,
				),
			},
			boundsMax: {
				value: new Vector3(CLOUD_WIDTH * 0.5, CLOUD_TOP, CLOUD_WIDTH * 0.5),
			},
			cameraWorldPosition: { value: new Vector3() },
			coverage: { value: 0.48 },
			densityMultiplier: { value: 0.78 },
			detailStrength: { value: 0.34 },
			insideCloud: { value: 0 },
			maxTraceDistance: { value: 260 },
			shadowStrength: { value: 1.1 },
			steps: { value: 14 },
			sunDirection: { value: sunDirection },
			time: { value: 0 },
		}),
		[],
	);

	useFrame(({ camera, clock }) => {
		const mesh = meshRef.current;
		const material = materialRef.current;
		if (!mesh || !material) return;

		cloudCenter.set(player.group.position.x, 0, player.group.position.z);
		boundsMin.set(
			cloudCenter.x - CLOUD_WIDTH * 0.5,
			CLOUD_BOTTOM,
			cloudCenter.z - CLOUD_WIDTH * 0.5,
		);
		boundsMax.set(
			cloudCenter.x + CLOUD_WIDTH * 0.5,
			CLOUD_TOP,
			cloudCenter.z + CLOUD_WIDTH * 0.5,
		);
		const cameraInsideCloud =
			camera.position.x >= boundsMin.x &&
			camera.position.x <= boundsMax.x &&
			camera.position.y >= boundsMin.y &&
			camera.position.y <= boundsMax.y &&
			camera.position.z >= boundsMin.z &&
			camera.position.z <= boundsMax.z;

		mesh.position.set(cloudCenter.x, CLOUD_CENTER_Y, cloudCenter.z);
		material.uniforms.boundsMin.value.copy(boundsMin);
		material.uniforms.boundsMax.value.copy(boundsMax);
		material.uniforms.time.value = clock.elapsedTime;
		material.uniforms.cameraWorldPosition.value.copy(camera.position);
		material.uniforms.insideCloud.value = cameraInsideCloud ? 1 : 0;
		material.uniforms.steps.value = cameraInsideCloud ? 6 : 14;
		material.uniforms.maxTraceDistance.value = cameraInsideCloud ? 80 : 260;
		material.uniforms.detailStrength.value = cameraInsideCloud ? 0 : 0.34;
		material.uniforms.shadowStrength.value = cameraInsideCloud ? 0 : 1.1;
		material.uniforms.densityMultiplier.value = cameraInsideCloud ? 0.42 : 0.64;
		material.uniforms.coverage.value = cameraInsideCloud ? 0.54 : 0.49;
	});

	return (
		<mesh
			ref={meshRef}
			position={[0, CLOUD_CENTER_Y, 0]}
			scale={[CLOUD_WIDTH, CLOUD_HEIGHT, CLOUD_WIDTH]}
			frustumCulled={false}>
			<boxGeometry args={[1, 1, 1]} />
			<shaderMaterial
				ref={materialRef}
				args={[{ uniforms, vertexShader, fragmentShader }]}
				transparent
				depthWrite={false}
				depthTest
				side={BackSide}
			/>
		</mesh>
	);
};

export default Clouds;
