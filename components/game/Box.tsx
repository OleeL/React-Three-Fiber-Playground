import React, { useState, useRef } from 'react'
import { useSpring, a } from 'react-spring/three.cjs'
import { useFrame } from 'react-three-fiber';

const Box = (props) => {
    const mesh = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const settings = useSpring({
        scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
        color: hovered ? "red" : "blue",
    }); 
    return (
        <a.mesh
            visible
            castShadow
            ref={mesh}
            {...props}
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={() => setActive(!active)}
            scale = {settings.scale}
        >
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <a.meshStandardMaterial
                attach="material" 
                color={settings.color}
                roughness={0.1}
                metalness={1}
                emissiveIntensity={0}
            />
        </a.mesh>
    )
}
export default Box;