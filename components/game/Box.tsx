import React, { useState, FC, useRef } from 'react'
import { useSpring, a, config } from 'react-spring/three.cjs'

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 0, flatShading: false }

const Box: FC<any> = (props) => {
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const settings = useSpring({
        scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
        color: hovered ? "rgb(1,0,0)" : "rgb(0,1,0)",
        config: config.stiff
    }); 
    return (
            <a.mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setActive(!active)}
                scale={settings.scale}
                castShadow
                receiveShadow
            >
                <boxBufferGeometry
                    attach="geometry"
                    args={[1, 1, 1]}
                />
                <meshPhysicalMaterial
                    attach="material" 
                    {...material}
                    color={settings.color}
                />
            </a.mesh>
    )
}
export default Box;