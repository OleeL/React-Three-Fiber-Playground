import React from "react";
import { Color } from "three";
import { noise } from "./perlin";
import { useUpdate } from "react-three-fiber";
import { _store, useStore, ISmallVector2 } from "../../stores/Store";

const specular = new Color("black");

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const chunksArraySize = 21; // Should be 2n - 1
let chunkPositions: ISmallVector2[] = [];

const Terrain = () => {
    const chunk = useStore(state => state.chunk);
    const chunkSize = _store.getState().chunkSize;

    console.log(chunk);

    const mesh = useUpdate(({ geometry }) => {
        noise.seed(Math.random());
        const pos = geometry.getAttribute("position");
        const pa = pos.array;
        const hVerts = geometry.parameters.heightSegments + 1;
        const wVerts = geometry.parameters.widthSegments + 1;
        for (let j = 0; j < hVerts; j++) {
            for (let i = 0; i < wVerts; i++) {
                const ex = 1.1;
                pa[3 * (j * wVerts + i) + 2] =
                    (noise.simplex2(i / 100, j / 100) +
                        noise.simplex2((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
                        noise.simplex2((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
                        noise.simplex2((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 3) +
                        +(noise.simplex2((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4))) /
                    2;
            }
        }

        pos.needsUpdate = true;
    }, []);

    chunkPositions = [];
    for (let x = chunk.x - Math.floor(chunksArraySize / 2); x <= chunk.x + Math.floor(chunksArraySize / 2); x++) {
        for (let y = chunk.y - Math.floor(chunksArraySize / 2); y <= chunk.y + Math.floor(chunksArraySize / 2); y++) {
            chunkPositions.push({x: x, y: y})
        }
    }

    return (
        <group>
            {
                chunkPositions.map((index, key) =>
                    <mesh
                        key={key}
                        ref={mesh}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[index.x * chunkSize, -1.5, index.y * chunkSize]}>
                        <planeBufferGeometry
                            attach="geometry"
                            args={[chunkSize, chunkSize, 12, 12]} />
                        <meshPhongMaterial
                            attach="material"
                            color={"white"}
                            specular={specular}
                            shininess={3}
                            //@ts-ignore
                            smoothShading
                        />
                    </mesh>
                )
            }
        </group>
    );
};

// const Terrain = () => {


//     return (
//         <group>
//             <Chunk />
//         </group>
//     );
// };


export default Terrain;