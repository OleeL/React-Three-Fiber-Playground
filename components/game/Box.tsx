import React, { useState, FC, useRef, forwardRef } from 'react'
import { useSpring, animated } from 'react-spring/three.cjs'
import { TStore } from '../../stores/Store';
import { useStore } from '../../stores/StoreContext';
const material = { transparent: true, roughness: 0.8, fog: true, shininess: 1, flatShading: false }

const Box: FC<any> = forwardRef((props, ref) => {
    const store: TStore = useStore();

    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const settings = useSpring({
        scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
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
                ref={ref}
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
});
export default Box;