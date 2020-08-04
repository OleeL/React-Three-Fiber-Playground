import React, { FC, useRef, useEffect } from 'react'
import { _store } from '../../stores/Store';
import Camera from './Camera';
import Model from './Model';
import { useThree } from 'react-three-fiber';

const Player: FC<any> = () =>
    <group  >
        <Model />
        <Camera />
    </group>
    
export default Player;