import React, { FC, useEffect } from 'react';
import { Color, Fog } from 'three';
import { useThree } from '@react-three/fiber';

const ATMOSPHERE_COLOR = new Color(0x000000);
const FOG_COLOR = new Color(0x888888);

const Lights: FC = () => {
	const { scene } = useThree();

	useEffect(() => {
		scene.fog = new Fog(FOG_COLOR, 0, 300);
	}, [scene]);

	return (
		<>
			<ambientLight
				color={ATMOSPHERE_COLOR}
				intensity={0.8}
				castShadow
				shadow={new Color(0x000000)}
			/>
			<hemisphereLight
				color={new Color(0xbbbbbb)}
				intensity={1}
				castShadow
				shadow={new Color(0x000000)}
			/>
		</>
	);
};

export default Lights;
