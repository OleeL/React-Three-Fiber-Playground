import React, { Suspense } from 'react';
import Camera from './Camera';
import Model from './Model';

const Player = () => {
	Camera();

	return (
		<Suspense fallback={null}>
			<Model />
		</Suspense>
	);
};

export default Player;
