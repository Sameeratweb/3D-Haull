import { Canvas } from "@react-three/fiber"
import { Environment, Center, OrbitControls } from "@react-three/drei"
import Model from './Model'
import Backdrop from "./Backdrop"
import CameraRig from './CamerRig'
import { useSnapshot } from 'valtio'
import state from '../store'

const CanvasModel = () => {
  const snap = useSnapshot(state)

  const wrapperClass = snap.intro
    ? "fixed top-0 left-0 w-full h-[45vh] z-20 pointer-events-auto xl:right-0 xl:left-auto xl:w-[50vw] xl:h-full xl:z-20 transition-all duration-500"
    : "hidden pointer-events-none"

  return (
    <div className={wrapperClass}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full transition-all ease-in"
      >
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          onStart={() => { 
            state.isDragging = true;
            state.hasInteracted = true;
          }}
          onEnd={() => { state.isDragging = false }}
        />
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
