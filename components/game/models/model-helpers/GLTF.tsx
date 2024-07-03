import { FC } from 'react';
import { Vector3, Euler, MaterialParameters, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';

interface IModelProps {
	name: string;
	position?: Vector3 | [number, number, number];
	scale?: Vector3 | [number, number, number];
	rotation?: Euler | [number, number, number, string?];
	any?: any;
}

// interface IModel {
// 	animations: any[];
// 	asset: object;
// 	cameras: any[];
// 	materials?: MeshPhysicalMaterial;
// 	scene: Group;
// 	scenes: Group[];
// 	userData: {};
// 	__$?: any[];
// }

const Render: FC<any> = props => (
	<mesh {...props.model}>
		<bufferGeometry {...props?.mesh.geometry} attach="geometry" />
		<meshStandardMaterial
			{...props?.mesh.material}
			attach="material"
			name="Material"
		/>
	</mesh>
);

const GetMeshes = (elements: []) =>
	Object.keys(elements)
		.filter(key => elements[key].type === 'Mesh')
		.map(key => elements[key]);

const GLTF: FC<IModelProps | MaterialParameters | Object3D> = model => {
	// const gltf: IModel = useLoader(GLTFLoader, "/models/"+model.name+".glb");
	const url = `/models/${model.name}.glb`;

	const { nodes } = useGLTF(url);

	// @ts-ignore
	const meshes: [] = GetMeshes(nodes);
	return (
		<group>
			{meshes.map((item, index) => (
				<Render mesh={item} key={index} model={model} />
			))}
		</group>
	);
};

export default GLTF;
