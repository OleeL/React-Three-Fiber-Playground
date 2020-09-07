import React, { FC, useEffect } from 'react'
import { ICamera, IPlayer, useStore } from '../../stores/Store';
import { useThree } from 'react-three-fiber';

const Camera: FC = () => {
    const camera: ICamera = useStore.getState().camera;
    const player: IPlayer = useStore.getState().player;

    const { setDefaultCamera, scene } = useThree();

    useEffect(() => {
        setDefaultCamera(camera.camera);
        scene.add(player.group);
        player.group.add(camera.camera);
        player.group.add(player.player);
        camera.camera.rotation.order = "YXZ"; // this is not the default
        camera.camera.position.set(0, 0, camera.distance);
        camera.camera.position.applyQuaternion(camera.camera.quaternion);
    },[]);

    return <mesh />
}
export default Camera;