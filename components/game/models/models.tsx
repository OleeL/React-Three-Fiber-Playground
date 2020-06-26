import { FC, Suspense } from "react"
import Box from "../Box"
import GLTF from "./model-helpers/GLTF"

const Models: FC = () => 
    <Suspense fallback={<Box />}>
        <GLTF
            name={"RetroChair"}
            position={[0, 0, 0]}
            scale={[0.02, 0.02, 0.02]}
            rotation={[90, 0, 0.5]}
        />
    </Suspense>

export default Models;