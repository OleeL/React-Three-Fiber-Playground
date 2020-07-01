import React, { FC, useRef, useEffect } from 'react'
import Box from './Box';
import { useStore } from '../../stores/StoreContext';
import { useThree } from 'react-three-fiber';

const Player: FC<any> = () => {
    const store = useStore();
    const { setDefaultCamera } = useThree();
    const {camera, player} = store;
    const ref = useRef();
    
    useEffect(() => {
        setDefaultCamera(camera.camera);
        if (ref.current) {
            store.player.player = ref.current;
            store.player.player.rotation.order = "YXZ"; // this is not the default
        }
        camera.camera.position.setX(camera.position.x);
        camera.camera.position.setY(camera.position.y);
        camera.camera.position.setZ(camera.position.z);
        camera.camera.setRotationFromEuler(camera.rotation);
    }, []);

    return (
        <group>
            <perspectiveCamera/>
            <Box
                position={player.position}
                ref={ref}
                />
        </group>
    )
}
export default Player;