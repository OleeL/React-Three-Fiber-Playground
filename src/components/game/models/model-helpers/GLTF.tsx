import { FC } from 'react';
import {
	Vector3,
	Euler,
	EulerOrder,
	Object3D,
	Mesh,
	MeshStandardMaterial,
	Material,
} from 'three';
import { useGLTF } from '@react-three/drei';
import { publicAssetPath } from '../../../../helpers/assets';

interface IModelProps {
	name: string;
	position?: Vector3 | [number, number, number];
	scale?: Vector3 | [number, number, number];
	rotation?: Euler | [number, number, number, EulerOrder?];
}

interface IRenderProps {
	model: {
		position?: Vector3;
		scale?: Vector3;
		rotation?: Euler;
	};
	mesh: Mesh;
}

const toVector3 = (
	value?: Vector3 | [number, number, number],
): Vector3 | undefined =>
	Array.isArray(value) ? new Vector3(...value) : value;

const toEuler = (
	value?: Euler | [number, number, number, EulerOrder?],
): Euler | undefined => (Array.isArray(value) ? new Euler(...value) : value);

const Render: FC<IRenderProps> = props => (
	<mesh {...props.model}>
		<bufferGeometry {...props?.mesh.geometry} attach="geometry" />
		<meshStandardMaterial
			{...(props.mesh.material as MeshStandardMaterial | Material)}
			attach="material"
			name="Material"
		/>
	</mesh>
);

const GetMeshes = (elements: { [name: string]: Object3D }) =>
	Object.keys(elements)
		.filter(key => elements[key].type === 'Mesh')
		.map(key => elements[key] as Mesh);

const GLTF: FC<IModelProps> = model => {
	const url = publicAssetPath(`/models/${model.name}.glb`);
	const { nodes } = useGLTF(url);
	const meshes = GetMeshes(nodes);

	const position = toVector3(model.position);
	const scale = toVector3(model.scale);
	const rotation = toEuler(model.rotation);

	return (
		<group position={position} scale={scale} rotation={rotation}>
			{meshes.map((item, index) => (
				<Render mesh={item} key={index} model={{ position, scale, rotation }} />
			))}
		</group>
	);
};

export default GLTF;
