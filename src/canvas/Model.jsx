import React, { useMemo } from 'react'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import state from '../store'

export default function Model(props) {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/Man.glb')

  // Clone materials independently so each mesh can have its own color
  const shirtMaterial = useMemo(() => materials['FABRIC_1_FRONT_1170.001'].clone(), [materials])
  const pantsMaterial = useMemo(() => materials['FABRIC_1_FRONT_1170.001'].clone(), [materials])
  const shoesMaterial = useMemo(() => materials['material_0'].clone(), [materials])
  const bodyMaterial = materials['Material.001']

  // Smooth color transitions per mesh
  useFrame((_state, delta) => {
    easing.dampC(shirtMaterial.color, snap.shirtColor, 0.25, delta)
    easing.dampC(pantsMaterial.color, snap.pantsColor, 0.25, delta)
    easing.dampC(shoesMaterial.color, snap.shoesColor, 0.25, delta)
  })

  return (
    <group {...props} dispose={null}>
      {/* Positioned downwards to center the full body in view */}
      <group position={[0, -1.2, 0]}>
        <mesh
          castShadow
          geometry={nodes.Body.geometry}
          material={bodyMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          geometry={nodes.Shoes_pair.geometry}
          material={shoesMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          geometry={nodes.Pants.geometry}
          material={pantsMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          geometry={nodes.Shirt.geometry}
          material={shirtMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/Man.glb')
