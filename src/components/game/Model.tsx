import { FC, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh, Object3D, Vector3 } from 'three';
import { publicAssetPath } from '../../helpers/assets';
import { useStore } from '../../stores/Store';

const planeModelPath = publicAssetPath('/models/embPlane2.glb');
const PROPELLER_NODE_NAME = 'Propeller';
const PROPELLER_SPIN_SPEED = 42;
const propellerCenter = new Vector3();
const propellerPositionOffset = new Vector3();

const getAreaWeightedGeometryCenter = (mesh: Mesh) => {
	const { geometry } = mesh;
	const position = geometry.getAttribute('position');
	const index = geometry.getIndex();
	let totalArea = 0;

	propellerCenter.set(0, 0, 0);

	if (!position || !index) {
		geometry.computeBoundingBox();
		geometry.boundingBox?.getCenter(propellerCenter);
		return propellerCenter;
	}

	for (let i = 0; i < index.count; i += 3) {
		const a = index.getX(i);
		const b = index.getX(i + 1);
		const c = index.getX(i + 2);
		const ax = position.getX(a);
		const ay = position.getY(a);
		const az = position.getZ(a);
		const abx = position.getX(b) - ax;
		const aby = position.getY(b) - ay;
		const abz = position.getZ(b) - az;
		const acx = position.getX(c) - ax;
		const acy = position.getY(c) - ay;
		const acz = position.getZ(c) - az;
		const crossX = aby * acz - abz * acy;
		const crossY = abz * acx - abx * acz;
		const crossZ = abx * acy - aby * acx;
		const area = Math.hypot(crossX, crossY, crossZ) * 0.5;

		if (area === 0) continue;

		propellerCenter.x +=
			((ax + position.getX(b) + position.getX(c)) / 3) * area;
		propellerCenter.y +=
			((ay + position.getY(b) + position.getY(c)) / 3) * area;
		propellerCenter.z +=
			((az + position.getZ(b) + position.getZ(c)) / 3) * area;
		totalArea += area;
	}

	if (totalArea > 0) propellerCenter.divideScalar(totalArea);
	return propellerCenter;
};

const centerPropellerPivot = (object: Object3D | undefined) => {
	if (!(object instanceof Mesh)) return;
	const { geometry } = object;
	const center = getAreaWeightedGeometryCenter(object);

	propellerPositionOffset
		.copy(center)
		.multiply(object.scale)
		.applyQuaternion(object.quaternion);
	geometry.translate(-center.x, -center.y, -center.z);
	object.position.add(propellerPositionOffset);
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();
};

const Model: FC = () => {
	const { scene: gltfScene } = useGLTF(planeModelPath);
	const scene = useMemo(() => {
		const clonedScene = gltfScene.clone(true) as Group;
		clonedScene.traverse(object => {
			if (object instanceof Mesh) object.geometry = object.geometry.clone();
		});
		centerPropellerPivot(clonedScene.getObjectByName(PROPELLER_NODE_NAME));
		return clonedScene;
	}, [gltfScene]);
	const propellerRef = useRef<Object3D | null>(null);

	useFrame((_, dt) => {
		if (!propellerRef.current) return;
		propellerRef.current.rotation.y +=
			Math.min(dt, 0.05) * PROPELLER_SPIN_SPEED;
	});

	useEffect(() => {
		scene.scale.set(0.2, 0.2, 0.2);
		scene.position.set(0, 0, 0);
		scene.rotation.set(0, Math.PI, 0);
		scene.updateMatrixWorld(true);

		propellerRef.current = scene.getObjectByName(PROPELLER_NODE_NAME) ?? null;

		const { player } = useStore.getState();
		const { group } = player;
		group.add(scene);

		return () => {
			group.remove(scene);
			propellerRef.current = null;
		};
	}, [scene]);

	return null;
};

useGLTF.preload(planeModelPath);

export default Model;
