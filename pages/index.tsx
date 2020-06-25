import React, { FC } from 'react';
import { Canvas } from 'react-three-fiber';
import Box from '../components/Box';
import Camera from '../components/camera';
import styled from 'styled-components';

const Game = styled.div`
    position: fixed;
    padding: 0;
    margin: 0;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
`

const index: FC = () => (
    <Game>
        <Canvas>
            <Camera />
            <Box />
        </Canvas>
    </Game>
);

export default index;