import { FC, Suspense } from "react"
import Box from "../Box"
import GLTF from "./model-helpers/GLTF"

const Models: FC = () => 
    <Suspense fallback={<Box />}>
        <GLTF
            name={"RetroChair"}
            position={[0, -1.33, 0]}
            scale={[0.02, 0.02, 0.02]}
            rotation={[1.5708, 0, 0]}
        />
    </Suspense>

export default Models;