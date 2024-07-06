import { FC } from 'react';
import {
	Vector3,
	Euler,
	EulerOrder,
	Object3D,
	Object3DEventMap,
	Mesh,
	BufferGeometry,
	Material,
	NormalBufferAttributes,
} from 'three';
import { useGLTF } from '@react-three/drei';
import { MeshProps, MeshStandardMaterialProps } from '@react-three/fiber';

interface IModelProps {
	name: string;
	position?: Vector3 | [number, number, number];
	scale?: Vector3 | [number, number, number];
	rotation?: Euler | [number, number, number, EulerOrder?];
}

interface IRenderProps {
	model: MeshProps;
	mesh: Mesh<
		BufferGeometry<NormalBufferAttributes>,
		Material | Material[],
		Object3DEventMap
	>;
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
			{...(props?.mesh.material as MeshStandardMaterialProps)}
			attach="material"
			name="Material"
		/>
	</mesh>
);

const GetMeshes = (elements: { [name: string]: Object3D<Object3DEventMap> }) =>
	Object.keys(elements)
		.filter(key => elements[key].type === 'Mesh')
		.map(key => elements[key] as Mesh);

const GLTF: FC<IModelProps> = model => {
	const url = `/models/${model.name}.glb`;
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
