import React, { FC, useRef } from 'react'
import Box from './Box';
import { useStore } from '../../stores/StoreContext';
import { useThree } from 'react-three-fiber';



const Player: FC<any> = (props) => {
    const store = useStore();
    const { setDefaultCamera } = useThree();
    const {camera, player} = store;
    const ref = useRef();

    setDefaultCamera(camera.camera);

    if (ref.current) store.setPlayer(ref.current);
    camera.camera.position.setZ(4);
    camera.camera.position.setY(1);
    camera.camera.setRotationFromEuler(camera.rotation);

    return (
        <group>
            <perspectiveCamera
                onUpdate={self => self.updateProjectionMatrix()}/>
            <Box
                ref={ref}
                position={player.position}/>
        </group>
    )
}
export default Player;