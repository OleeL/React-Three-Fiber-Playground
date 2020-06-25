import React, { useState } from 'react'
import { useSpring, a } from 'react-spring/three.cjs'

const Box = () => {
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const props = useSpring({
        scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
        color: hovered ? "red" : "gray",
    }); 

    return (
    <a.mesh
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive(!active)}
        scale = {props.scale}
    >
        <boxBufferGeometry attach="geometry" args={[4, 1]} />
        <a.meshBasicMaterial
            attach="material" 
            color={props.color}
        />
    </a.mesh>
    )
}
export default Box;