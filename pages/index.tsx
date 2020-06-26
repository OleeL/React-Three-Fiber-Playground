import React, { FC, Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Box from '../components/game/Box';
import Camera from '../components/game/camera/camera';
import styled from 'styled-components';
import Light from '../components/game/Light';
import Model from '../components/game/models/model-helpers/GLTF';
import Models from '../components/game/models/models';

const Game = styled.div`
    position: fixed;
    padding: 0;
    margin: 0;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background: rgb(48,25,52);
`

const index: FC = () => (
    <Game>
        <Canvas
            concurrent
            colorManagement
        >
            <Light  />
            <Camera position={[0, 0, 0]} />
            <Models />
        </Canvas>
    </Game>
);

export default index;