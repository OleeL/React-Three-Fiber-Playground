import { FC, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { publicAssetPath } from '../../helpers/assets';
import { useStore } from '../../stores/Store';

const planeModelPath = publicAssetPath('/models/embPlane.glb');

const Model: FC = () => {
	const { scene } = useGLTF(planeModelPath);
	const { player } = useStore.getState();

	useEffect(() => {
		scene.scale.set(0.2, 0.2, 0.2);
		scene.position.set(0, 0, 0);
		scene.rotation.set(0, Math.PI, 0);

		player.playerMesh = scene;
		player.group.add(scene);

		return () => {
			player.group.remove(scene);
		};
	}, [player, scene]);

	return null;
};

useGLTF.preload(planeModelPath);

export default Model;
