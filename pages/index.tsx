import React, { FC } from 'react';
import { Canvas } from 'react-three-fiber';
import Box from '../components/Box';
import Camera from '../components/camera';

const index: FC = () => (
    <Canvas>
        <Camera />
        <Box />
    </Canvas>
);

export default index;