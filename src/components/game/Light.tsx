import React, { FC, useEffect } from 'react';
import { Color, Fog } from 'three';
import { useThree } from '@react-three/fiber';

const ATMOSPHERE_COLOR = new Color(0xcfe9ff);
const FOG_COLOR = new Color(0xb8d3de);

const Lights: FC = () => {
	const { scene } = useThree();

	useEffect(() => {
		scene.fog = new Fog(FOG_COLOR, 1200, 3200);
	}, [scene]);

	return (
		<>
			<ambientLight color={ATMOSPHERE_COLOR} intensity={1.35} />
			<hemisphereLight
				color={new Color(0xeaf7ff)}
				groundColor={new Color(0x7dbf6a)}
				intensity={1.25}
			/>
			<directionalLight
				color={new Color(0xfff1c7)}
				intensity={1.8}
				position={[120, 180, 80]}
			/>
		</>
	);
};

export default Lights;
