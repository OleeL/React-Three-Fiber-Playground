import React, { FC } from 'react';
import { Canvas } from 'react-three-fiber';
import styled from 'styled-components';
import Lights from '../components/game/Light';
import Models from '../components/game/models/Models';
import Controls, { ControlUpdate } from '../components/game/controls/Controls';
import Player from '../components/game/Player';

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

const Game: FC = () => {
    Controls();
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