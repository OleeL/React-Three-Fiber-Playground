import React, { FC } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import Lights from './Light';
import Models from './models/Models';
import CreateControls, { LoopControls } from './controls/Controls';
import Player from './Player';
import Statistics, { AddStatistics } from './Statistics';
import css from "styled-jsx/css";
import { useStore } from '../../stores/Store';
import Terrain from '../terrain/terrain';
import Overlay from './Overlay';

const GameStyle = css`
    div {
        position: fixed;
        padding: 0;
        margin: 0;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        background: rgb(135, 206, 235);
    }
`


const ControlUpdate = () => {
    const { player, camera } = useStore.getState();
    let previousTime = 0;

    useFrame(state => {
        const time = state.clock.getElapsedTime();
        const dt = (time - previousTime) / 1000;
        LoopControls(dt, player, camera);
        AddStatistics();

        previousTime = time;
    });
    return <mesh />
}

const Game: FC = () => {
    CreateControls();
    return (
        <div>
            <Canvas
                concurrent
                colorManagement
                id="Canvas">
                <Terrain />
                <ControlUpdate />
                <Lights />
                <Player />
                <Models />
            </Canvas>
            <Overlay />
            <Statistics />
            <style jsx>{GameStyle}</style>
        </div>
    )
};

export default Game;