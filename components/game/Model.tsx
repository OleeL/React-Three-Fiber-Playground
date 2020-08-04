import React, { FC, useRef, useEffect } from 'react'
import Box from './Box';
import { _store, IPlayer } from '../../stores/Store';

const Model: FC<any> = () => {
    const player: IPlayer = _store.getState().player;
    const ref = useRef();
    
    useEffect(() => {
        if (ref.current) {
            player.player = ref.current;
            player.player.rotation.order = "YXZ"; // this is not the default
        }
    }, []);

    return (
        <group >
            <Box
                position={player.position}
                ref={ref}
                />
        </group>
    )
}
export default Model;