import React, { FC, useLayoutEffect } from 'react'
import Box from './Box';
import { useStore, IPlayer } from '../../stores/Store';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';

const Model: FC = () => {
    const player: IPlayer = useStore.getState().player;

    let ref = null;

    useLayoutEffect(() => {
        if (!ref?.current) return;
        ref.rotation.order = "YXZ"; // this is not the default
        player.player = ref;
    });
    
    return (
        <Box
            position={player.position}
            model={ref}/>
    );
}

export default Model;