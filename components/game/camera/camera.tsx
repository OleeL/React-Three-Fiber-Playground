import { useRef, FC } from "react";
import { useFrame, extend, useThree, ReactThreeFiber } from 'react-three-fiber';
import { OrbitControls } from './OrbitControls';
import { Vector3, Euler } from "three";

// Make OrbitControls known as <orbitControls />
extend({ OrbitControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

interface ISettings {
  position?: Vector3 | [number, number, number];
  rotation?: Euler | [number, number, number, string?];
}

const Camera: FC<ISettings> = (props) => {
    const ref = useRef();
    const { camera, gl } = useThree();

    useFrame(() => {
      //@ts-ignore
      ref.current.update();
    });
    
    return <orbitControls 
        ref={ref}
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
    />
}

export default Camera;