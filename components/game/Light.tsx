import React, { FC } from 'react'
import { Color } from 'three';
import Box from './Box';

const ColorBlack = new Color(0, 0, 0);
const ColorWhite = new Color(1, 1, 1);
const arr: [number, number, number] = [-2.5, 5, 2.5]

const Lights: FC = () => 
    <group>
        <fog
            color={ColorBlack}
        />
        <ambientLight
            color={ColorWhite}
            intensity={.1}
        />
        <pointLight
            position={arr}
            intensity={1}
        />
        <Box position={arr}/>
    </group>
    
export default Lights;