import React, { FC } from 'react'
import { Color } from 'three';

const ColorBlack = new Color(0, 0, 0);

const Light: FC = () => 
    <>
        <fog
            color={ColorBlack}
        />
        <ambientLight 
            color={ColorBlack}
            intensity={1000}
            position={[10, 100, 10]}
        />
        <pointLight 
            position={[10, 20, 10]}
            intensity={1}
        />
    </>

export default Light;