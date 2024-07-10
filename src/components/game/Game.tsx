import React, { FC, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import css from 'styled-jsx/css';
import Lights from './Light';
import Models from './models/Models';
import CreateControls, { LoopControls } from './controls/Controls';
import Player from './Player';
import Statistics, { AddStatistics } from './Statistics';
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
		display: flex;
		justify-content: center;
		align-items: center;
	}
	canvas {
		display: block;
		width: 100%;
		height: auto;
		max-height: 100%;
	}
`;

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
	return <mesh />;
};

const Game: FC = () => {
	CreateControls();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const handleResize = () => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				canvas.style.width = `${window.innerWidth}px`;
				canvas.style.height = `${window.innerHeight}px`;
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div>
			<Canvas linear id="Canvas" ref={canvasRef}>
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
	);
};

export default Game;
