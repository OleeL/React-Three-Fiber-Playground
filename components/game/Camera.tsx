import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../stores/Store';

const Camera = () => {
	const { camera } = useStore.getState();
	const { player } = useStore.getState();

	const { set, scene } = useThree();

	useEffect(() => {
		set(x => {
			x.camera = camera.camera;
		});
		scene.add(player.group);
		player.group.add(camera.camera);
		player.group.add(player.player);
		camera.camera.rotation.order = 'YXZ'; // this is not the default
		camera.camera.position.set(0, 0, camera.distance);
		camera.camera.position.applyQuaternion(camera.camera.quaternion);
	}, [camera.camera, camera.distance, player.group, player.player, scene, set]);
};
export default Camera;
