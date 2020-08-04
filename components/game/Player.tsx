import React, { FC } from 'react'
import { _store } from '../../stores/Store';
import Camera from './Camera';
import Model from './Model';

const Player: FC<any> = () =>
    <group  >
        <Model />
        <Camera />
    </group>
    
export default Player;