import React, { useState, forwardRef } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Mesh, Vector3Tuple } from 'three';

const material = {
	transparent: true,
	roughness: 0.8,
	fog: true,
	shininess: 1,
	flatShading: false,
} as const;

const Box = (
	props: React.ComponentProps<typeof a.mesh>,
	ref: React.Ref<Mesh>,
) => {
	const [hovered, setHovered] = useState(false);
	const [active, setActive] = useState(false);
	const settings = useSpring({
		scale: (active
			? [0.5, 0.5, 0.5]
			: [0.25, 0.25, 0.25]) satisfies Vector3Tuple,
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
