import React, { useState } from 'react'
import { Color } from 'three';

const ColorBlack = new Color(0, 0, 0);

const Light = () => 
    <>
        <fog
            color={ColorBlack}
        />
        <ambientLight 
            color={ColorBlack}
            intensity={10}
            position={[10, 100, 10]}
        />
        <pointLight 
            position={[10, 20, 10]}
            intensity={1000}
        />
        <pointLight 
            position={[-10, -20, -10]}
            intensity={1000}
        />
    </>

export default Light;