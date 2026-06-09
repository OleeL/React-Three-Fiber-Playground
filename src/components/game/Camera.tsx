import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../stores/Store';

const Camera = () => {
	const { set, scene } = useThree();

	useEffect(() => {
		const { camera, player } = useStore.getState();
		const playerGroup = player.group;
		const gameCamera = camera.camera;

		set({ camera: gameCamera });
		playerGroup.rotation.order = 'YXZ';
		playerGroup.position.copy(player.position);
		gameCamera.rotation.order = 'YXZ';
		scene.add(playerGroup);
		scene.add(gameCamera);

		return () => {
			scene.remove(playerGroup);
			scene.remove(gameCamera);
		};
	}, [scene, set]);
};
export default Camera;
