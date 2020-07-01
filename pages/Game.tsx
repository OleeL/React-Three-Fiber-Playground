import React, { FC, useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import styled from 'styled-components';
import Lights from '../components/game/Light';
import Models from '../components/game/models/Models';
import CreateControls, { LoopControls } from '../components/game/controls/Controls';
import Player from '../components/game/Player';
import { useStore } from '../stores/StoreContext';

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
    const dt = store.clock.getDelta();
    useFrame(() => {
        LoopControls(store, dt);
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
        </GameStyle>
    )
};

export default Game;