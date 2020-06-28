import React, { FC, useRef } from 'react'
import { Camera, Euler } from 'three';
import Box from './Box';
import { useStore } from '../../stores/StoreContext';
import { useThree } from 'react-three-fiber';

const EulerCameraRotation = new Euler(-0.349066,0,0);

const Player: FC<any> = (props) => {
    const store = useStore();

    const camera = store.camera;
    const { setDefaultCamera, mouse } = useThree();
    setDefaultCamera(camera);

    const ref = useRef();
    if (ref.current) store.setPlayer(ref.current);

    camera.position.setZ(4);
    camera.position.setY(1);
    camera.setRotationFromEuler(EulerCameraRotation);
    console.log(ref.current);

    return (
        <group>
            <perspectiveCamera
                onUpdate={self => self.updateProjectionMatrix()} 
                />
            <Box ref={ref} position={[0, 0, 0]}
                />
        </group>
    )
}
export default Player;