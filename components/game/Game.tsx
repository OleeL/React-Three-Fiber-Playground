import React, { FC, useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import Lights from './Light';
import Models from './models/Models';
import CreateControls, { LoopControls } from './controls/Controls';
import Player from './Player';
import { LoopMouseControl } from './controls/PointerLockControls';
import Statistics from './Statistics';
import css from "styled-jsx/css";

const GameStyle = css`
    div {
        position: fixed;
        padding: 0;
        margin: 0;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        background: grey;
    }
`


const ControlUpdate = () => {
    const ref = useRef();
    let previousTime = 0;
    useFrame(state => {
        const time = state.clock.getElapsedTime();
        const dt = (time - previousTime) / 1000;
        LoopControls(dt);
        LoopMouseControl(dt);
        previousTime = time;
    });
    return <mesh ref={ref} />
}

const Game: FC = () => {
    CreateControls();
    return (
        <div>
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
            <Statistics />
            <style jsx>{GameStyle}</style>
        </div>
    )
};

export default Game;