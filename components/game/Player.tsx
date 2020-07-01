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
    
    if (ref.current) store.player.player = ref.current;
    camera.camera.position.setX(camera.position.x);
    camera.camera.position.setY(camera.position.y);
    camera.camera.position.setZ(camera.position.z);
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