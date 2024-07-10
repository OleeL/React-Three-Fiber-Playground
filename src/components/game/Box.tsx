import React, { useState, forwardRef, ComponentProps } from 'react';
import { useSpring, a, AnimatedComponent } from '@react-spring/three';
import { MeshProps, Vector3 } from '@react-three/fiber';
import {
	Mesh,
	BufferGeometry,
	NormalBufferAttributes,
	Material,
	Object3DEventMap,
} from 'three';

const material = {
	transparent: true,
	roughness: 0.8,
	fog: true,
	shininess: 1,
	flatShading: false,
} as const;

const Box = (
	props: ComponentProps<AnimatedComponent<React.FC<MeshProps>>>,
	ref: React.Ref<
		Mesh<
			BufferGeometry<NormalBufferAttributes>,
			Material | Material[],
			Object3DEventMap
		>
	>,
) => {
	const [hovered, setHovered] = useState(false);
	const [active, setActive] = useState(false);
	const settings = useSpring({
		scale: (active ? [0.5, 0.5, 0.5] : [0.25, 0.25, 0.25]) satisfies Vector3,
		color: hovered ? 'orange' : 'red',
	});

	return (
		<group>
			<a.mesh
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				scale={settings.scale}
				onClick={() => setActive(!active)}
				castShadow
				receiveShadow
				ref={ref}
				{...props}
				{...settings}>
				<a.boxGeometry args={[1, 1, 1]} />
				<a.meshStandardMaterial {...material} color={settings.color} />
			</a.mesh>
		</group>
	);
};

export default forwardRef(Box);
