import { FC, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../../stores/Store';

const Model: FC = () => {
	const { scene } = useGLTF('/models/embPlane.glb');
	const { player } = useStore.getState();

	useEffect(() => {
		scene.scale.set(0.2, 0.2, 0.2);
		scene.position.set(0, 0, 0);
		scene.rotation.set(0, 0, 0);

		player.playerMesh = scene;
		player.group.add(scene);

		return () => {
			player.group.remove(scene);
		};
	}, [player, scene]);

	return null;
};

useGLTF.preload('/models/embPlane.glb');

export default Model;
