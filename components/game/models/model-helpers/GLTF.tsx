import { useLoader } from 'react-three-fiber';
import { GLTFLoader, GLTFParser } from "./GLTFLoader"
import { FC, Suspense } from 'react';
import Box from '../../Box';
import { MeshPhysicalMaterial, Group, Vector3, Euler, MaterialParameters, Object3D } from 'three';

interface IModelProps {
    name: string,
    position?: Vector3 | [number, number, number],
    scale?: Vector3 | [number, number, number],
    rotation?: Euler | [number, number, number, string?],
    any?: any
}

interface IModel {
    animations: any[],
    asset: object,
    cameras: any[],
    materials?: MeshPhysicalMaterial,
    parser: GLTFParser,
    scene: Group,
    scenes: Group[],
    userData: {},
    __$?: any[]
}

const GLTF: FC<IModelProps | MaterialParameters | Object3D> = ( model ) => {
    const gltf: IModel = useLoader(GLTFLoader, "/models/"+model.name+".glb");
    // console.log(gltf);
    const geometry = gltf.__$[3].geometry;
    const material = gltf.__$[3].material;
    
    return (
        <Suspense fallback = {<Box />}>
            <mesh {...model}>
                <bufferGeometry attach="geometry" {...geometry} />
                <meshStandardMaterial attach="material" {...material} name="Material" />
            </mesh>
        </Suspense>
    );
}

export default GLTF;