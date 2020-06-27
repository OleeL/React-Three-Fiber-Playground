import React, { useState, FC, useRef } from 'react'
import { useSpring, animated } from 'react-spring/three.cjs'
const material = { transparent: true, roughness: 0.8, fog: true, shininess: 1, flatShading: false }

const Box: FC<any> = (props) => {
    const ref = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const settings = useSpring({
        scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
        color: hovered ? "pink" : "red"
    });
    
    return (
            <animated.mesh
                ref={ref}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setActive(!active)}
                scale={settings.scale}
                castShadow
                receiveShadow
                {...props}
                {...settings}>
                <animated.boxBufferGeometry
                    attach="geometry"
                    args={[1, 1, 1]}/>
                <animated.meshStandardMaterial
                    attach="material"
                    {...material}
                    color={settings.color}/>
            </animated.mesh>
    )
}
export default Box;