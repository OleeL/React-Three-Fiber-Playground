import React, { FC } from 'react'
import Box from './Box';
import { useStore, IPlayer } from '../../stores/Store';
import { useUpdate } from 'react-three-fiber';
import { Mesh } from 'three';

const Model: FC = () => {
    const player: IPlayer = useStore.getState().player;

    const ref = useUpdate((props: Mesh) => {
        if (!ref.current) return;
        props.rotation.order = "YXZ"; // this is not the default
        player.player = props;
    }, []);
    
    return (
        <Box
            position={player.position}
            model={ref}/>
    );
}

export default Model;