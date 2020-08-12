import React, { FC, useMemo, useEffect } from "react";
import { Color } from "three";
import { noise } from "./perlin";
import { useUpdate } from "react-three-fiber";
import { _store, useStore, ISmallVector2 } from "../../stores/Store";
import shallow from 'zustand/shallow';

const specular = new Color("black");
const sessionSeed = Math.random();

export const GetChunkX = (x: number, w: number): number => Math.round(x / w);
export const GetChunkY = (y: number, h: number): number => Math.round(y / h);

const renderDistance = 5; // Should be 2n - 1

interface ITerrainData {
    chunkSize: number;
    chunk: ISmallVector2;
}

const Chunk: FC<ITerrainData> = ({ chunk, chunkSize }) => {
    const mesh = useUpdate(({ geometry }) => {
        const pos = geometry.getAttribute("position");
        const pa = pos.array;
        const hVerts = geometry.parameters.heightSegments + 1;
        const wVerts = geometry.parameters.widthSegments + 1;
        const x = chunk.x * chunkSize;
        const y = chunk.y * chunkSize;
        for (let j = 0; j < hVerts; j++) {
            for (let i = 0; i < wVerts; i++) {
                const ex = 1.1;
                pa[3 * (j * wVerts + i) + 2] =
                    (noise.simplex2(i + x / 100, (j + y) / 100)
                        + noise.simplex2((i + x + 200) / 50, (j + y) / 50) * Math.pow(ex, 1)
                        + noise.simplex2((i + x + 400) / 25, (j + y) / 25) * Math.pow(ex, 2)
                        + noise.simplex2((i + x + 600) / 12.5, (j + y) / 12.5) * Math.pow(ex, 3)
                        + noise.simplex2((i + x + 800) / 6.25, (j + y) / 6.25) * Math.pow(ex, 4)
                    ) / 2;
            }
        }

        pos.needsUpdate = true;
    }, [chunk]);

    return (
        <mesh
            ref={mesh}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[chunk.x * chunkSize, -1.5, chunk.y * chunkSize]}>
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
    );
};

const Terrain = () => {

    useEffect(() => noise.seed(sessionSeed), []);

    const [chunk] = useStore(state => [state.chunk], shallow);
    const chunkSize = _store.getState().chunkSize;

    console.log("chunk");
    const chunkPositions: ISmallVector2[] = useMemo(() => {
        const chunkPositions = [];
        for (let x = chunk.x - Math.floor(renderDistance / 2); x <= chunk.x + Math.floor(renderDistance / 2); x++) {
            for (let y = chunk.y - Math.floor(renderDistance / 2); y <= chunk.y + Math.floor(renderDistance / 2); y++) {
                chunkPositions.push({ x: x, y: y })
            }
        }
        return chunkPositions;
    }, [chunk])

    return (
        <group>
            {chunkPositions.map((index, key) =>
                <Chunk
                    key={key}
                    chunk={index}
                    chunkSize={chunkSize}
                />)}
        </group>
    );
};


export default Terrain;