import { Canvas } from "@react-three/fiber"
import { Environment, Center, OrbitControls } from "@react-three/drei"
import Model from './Model'
import Backdrop from "./Backdrop"
import CameraRig from './CamerRig'

const CanvasModel = () => {
  return (
    <div className="w-full h-full xl:fixed xl:right-0 xl:top-0 xl:w-[50vw]">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full transition-all ease-in"
      >
        <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 4} />
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <CameraRig>
          <Backdrop />
          <Center>
            <Model />
          </Center>
        </CameraRig>
      </Canvas>
    </div>
  )
}

export default CanvasModel
