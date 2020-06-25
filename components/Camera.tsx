import { useRef, FC } from "react";
import { useFrame, extend, useThree, ReactThreeFiber } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Make OrbitControls known as <orbitControls />
extend({ OrbitControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

const Camera: FC = (props) => {
    const ref = useRef();
    const { camera, gl } = useThree();

    //@ts-ignore
    useFrame(() => ref.obj.current.update());
    return <orbitControls 
        ref={ref}
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
        {...props}
    />
}

export default Camera;