import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'

/**
 * MeshPreviewCanvas — renders a single mesh from Man.glb with auto-rotation.
 * Meant to be used inside a small <Canvas> in a product card.
 *
 * @param {string} meshName  - 'Shirt' | 'Pants' | 'Shoes_pair'
 * @param {string} color     - hex color string for the mesh material
 */
export default function MeshPreview({ meshName, color }) {
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('/Man.glb')

  // Determine which material to clone based on mesh
  const baseMaterial = meshName === 'Shoes_pair'
    ? materials['material_0']
    : materials['FABRIC_1_FRONT_1170.001']

  const clonedMaterial = useMemo(() => {
    const mat = baseMaterial.clone()
    mat.color.set(color)
    return mat
  }, [baseMaterial])

  // Keep color in sync
  useFrame(() => {
    if (clonedMaterial) {
      clonedMaterial.color.set(color)
    }
  })

  // Auto rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8
    }
  })

  const node = nodes[meshName]
  if (!node) return null

  return (
    <group ref={groupRef}>
      <Center>
        <mesh
          geometry={node.geometry}
          material={clonedMaterial}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        />
      </Center>
    </group>
  )
}

useGLTF.preload('/Man.glb')
