import React, { FC, useRef } from 'react';
import Box from './Box';
import { useStore, IPlayer } from '../../stores/Store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OnUpdate = (e: any, player: IPlayer) => {
	e.rotation.order = 'YXZ'; // this is not the default
	player.player = e;
};

const Model: FC = () => {
	const { player } = useStore.getState();

	const ref = useRef();

	return (
		<Box
			onUpdate={e => OnUpdate(e, player)}
			position={player.position}
			ref={ref}
		/>
	);
};

export default Model;
