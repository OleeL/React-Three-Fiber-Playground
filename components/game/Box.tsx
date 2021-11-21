import React, { useState, FC } from 'react'
import { useSpring, animated } from '@react-spring/three'

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 1, flatShading: false }

const Box: FC<any> = (props) => {
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const settings = useSpring({
        scale: active ? [.5, .5, .5] : [.25, .25, .25],
        color: hovered ? "orange" : "red"
    });

    return (
        <group>
            <animated.mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setActive(!active)}
                scale={settings.scale}
                castShadow
                receiveShadow
                ref={props.model}
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
        </group>
    )
};

export default Box;