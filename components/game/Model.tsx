import React, { FC, useRef, useEffect, memo, useMemo } from 'react'
import Box from './Box';
import { _store, IPlayer, useStore } from '../../stores/Store';
import { useUpdate } from 'react-three-fiber';
import { Mesh } from 'three';

const Model: FC = () => {
    const player: IPlayer = _store.getState().player;

    const ref = useUpdate((props: Mesh) => {
        props.rotation.order = "YXZ"; // this is not the default
        player.player = props;
    }, []);
    
    return (
        <group >
            <Box
                position={player.position}
                model={ref}/>
        </group>
    );
}

export default Model;