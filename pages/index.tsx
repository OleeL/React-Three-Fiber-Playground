import React, { FC, Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Camera from '../components/game/camera/camera';
import styled from 'styled-components';
import Lights from '../components/game/Light';
import Models from '../components/game/models/models';

const Game = styled.div`
    position: fixed;
    padding: 0;
    margin: 0;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background: grey;
`

const index: FC = () => (
    <Game>
        <Canvas
            concurrent
            colorManagement
        >
            <Lights  />
            <Camera position={[0, 0, 0]} />
            <Models />
        </Canvas>
    </Game>
);

export default index;