import { FC, Suspense } from "react"
import Box from "../Box"
import GLTF from "./model-helpers/GLTF"

const Models: FC = () =>
    <Suspense fallback={<Box />}>
        <GLTF
            name={"embPlane"}
            position={[0, -1.5, 0]}
            scale={[0.2, 0.2, 0.2]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
        />
    </Suspense>

export default Models;