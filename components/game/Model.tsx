import React, { FC, useEffect, useRef } from 'react'
import Box from './Box';
import { useStore, IPlayer } from '../../stores/Store';

const OnUpdate = (e: any, player: IPlayer) => {
    e.rotation.order = "YXZ"; // this is not the default
    player.player = e;
}

const Model: FC = () => {
    const player: IPlayer = useStore.getState().player;

    const ref = useRef();
    useEffect(() => {

    }, []);
    
    return (
        <Box
            onUpdate={e => OnUpdate(e, player)}
            position={player.position}
            model={ref}/>
    );
}

export default Model;