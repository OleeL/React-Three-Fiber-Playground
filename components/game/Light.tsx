import React, { FC, useEffect } from 'react'
import { Color, FogExp2 } from 'three';
import { useThree } from 'react-three-fiber';

const ColorBlack = new Color(0, 0, 0);
const ColorWhite = new Color(1, 1, 1);
const arr: [number, number, number] = [-2.5, 10, 2.5]

const Lights: FC = () => {
    const { scene } = useThree();

    useEffect(() => {
        scene.fog = new FogExp2(0x87ceeb, 0.012);
    },[]);

    return (
        <>
            <ambientLight
                color={ColorWhite}
                intensity={.1}
            />
            <pointLight
                position={arr}
                intensity={.5}
            />
        </>
    )
}
    
export default Lights;