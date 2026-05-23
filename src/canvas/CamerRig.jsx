import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import state from '../store'
const CameraRig = ({ children }) => {
  const group = useRef()
  const snap = useSnapshot(state)

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition = [0, -0.2, 2.9];
    if (snap.intro) {
      if (isMobile) targetPosition = [0, 0, 4.2];
    } else {
      if (isMobile) targetPosition = [0, 0, 4.2];
      else targetPosition = [0, 0, 3.6];
    }

    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    // set the model rotation smoothly based on mouse position + page scroll
    const scrollRotation = snap.intro ? (window.scrollY * 0.005) : 0;
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5 + scrollRotation, 0],
      0.25,
      delta,
    )
  })

  return (
    <group ref={group}>
      {children}
    </group>
  )
}

export default CameraRig
