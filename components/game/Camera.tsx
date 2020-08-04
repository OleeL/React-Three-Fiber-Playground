import React, { FC, useRef, useEffect } from 'react'
import Box from './Box';
import { useStore, _store, ICamera, IPlayer } from '../../stores/Store';
import { useThree } from 'react-three-fiber';


const Camera: FC = () => {
    const camera: ICamera = _store.getState().camera;
    const player: IPlayer = _store.getState().player;

    const { setDefaultCamera, scene } = useThree();

    useEffect(() => {
        setDefaultCamera(camera.camera);
        scene.add(player.group);
        player.group.add(camera.camera);
    },[]);

    return <mesh />
}
export default Camera;