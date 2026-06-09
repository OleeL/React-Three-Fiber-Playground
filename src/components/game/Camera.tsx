import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../stores/Store';

const Camera = () => {
	const { camera } = useStore.getState();
	const { player } = useStore.getState();

	const { set, scene } = useThree();

	useEffect(() => {
		set({ camera: camera.camera });
		player.group.rotation.order = 'YXZ';
		player.group.position.copy(player.position);
		scene.add(player.group);
		scene.add(camera.camera);
		camera.camera.rotation.order = 'YXZ'; // this is not the default
	}, [
		camera.camera,
		camera.distance,
		player.group,
		player.position,
		scene,
		set,
	]);
};
export default Camera;
