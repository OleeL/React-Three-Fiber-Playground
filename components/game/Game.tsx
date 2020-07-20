import React, { FC, useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import styled from 'styled-components';
import Lights from './Light';
import Models from './models/Models';
import CreateControls, { LoopControls } from './controls/Controls';
import Player from './Player';
import { useStore } from '../../stores/StoreContext';
import { LoopMouseControl } from './controls/PointerLockControls';
import Stats from './Stats';

const GameStyle = styled.div`
    position: fixed;
    padding: 0;
    margin: 0;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background: grey;
`


const ControlUpdate = () => {
    const store = useStore();
    const ref = useRef();
    let previousTime = 0;
    useFrame(state => {
        const time = state.clock.getElapsedTime();
        const dt = (time - previousTime) / 1000;
        LoopControls(store, dt);
        LoopMouseControl(store, dt);
        previousTime = time;
    });
    return <mesh ref={ref} />
}

const Game: FC = () => {
    CreateControls();
    return (
        <GameStyle>
            <Canvas
                concurrent
                colorManagement
                id="Canvas">
                <ControlUpdate />
                <Lights  />
                {/* <Camera position={[0, 0, 0]} /> */}
                <Player />
                <Models />
            </Canvas>
            <Stats />

        </GameStyle>
    )
};

export default Game;