import { useLoader } from 'react-three-fiber';
import { FC } from 'react';
import { MeshPhysicalMaterial, Group, Vector3, Euler, MaterialParameters, Object3D } from 'three';
import { GLTFLoader, GLTFParser } from './GLTFLoader';

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

//@ts-ignore
const GetMeshes = (elements: []) => Object.keys(elements)
    .filter(key => elements[key].type === "Mesh")
    .map(key => elements[key]);

const GLTF: FC<IModelProps | MaterialParameters | Object3D> = ( model ) => {
    const gltf: IModel = useLoader(GLTFLoader, "/models/"+model.name+".glb");

    //@ts-ignore
    const meshes: [] = GetMeshes(gltf.nodes);
    return (
        <group>
            {meshes.map((item, index) =>
                <Render mesh={item} key={index} model={model} />
            )}
        </group>
    );
}

const Render: FC<any> = (props) => 
    <mesh {...props.model}>
        <bufferGeometry
            {...props?.mesh.geometry}
            attach="geometry"/>
        <meshStandardMaterial
            {...props?.mesh.material}
            attach="material" 
            name="Material" />
    </mesh>

export default GLTF;