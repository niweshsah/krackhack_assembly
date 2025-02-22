/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/microphone.glb 
Author: Helindu (https://sketchfab.com/Helindu)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/microphone-a02d9505b3434adf84bc01bea7af4548
Title: Microphone
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/microphone.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, 4.06, 29.371]} rotation={[-Math.PI / 2, 0, 0]} scale={25.5}>
        <mesh geometry={nodes.Cylinder_Material003_0.geometry} material={materials['Material.003']} />
        <mesh geometry={nodes.Cylinder_Material002_0.geometry} material={materials['Material.002']} />
      </group>
      <group position={[0, 2.006, -34.173]} rotation={[-Math.PI / 2, 0, 0]} scale={25.5}>
        <mesh geometry={nodes.Cylinder002_Material002_0.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cylinder002_Material001_0.geometry} material={materials['Material.001']} />
      </group>
      <mesh geometry={nodes.Cylinder001_Material_0.geometry} material={materials.Material} position={[0, 1.998, -41.683]} rotation={[-Math.PI / 2, 0, 0]} scale={25.5} />
      <mesh geometry={nodes.BezierCurve_Material008_0.geometry} material={materials['Material.008']} position={[0, 2.006, 106.77]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={62.423} />
      <mesh geometry={nodes.Cube001_Material009_0.geometry} material={materials['Material.009']} position={[0.033, -54.88, 20.554]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Cylinder003_Material006_0.geometry} material={materials['Material.006']} position={[0.033, -6.3, 20.555]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Cylinder004_Material005_0.geometry} material={materials['Material.005']} position={[4.778, -35.077, 20.554]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Cylinder007_Material004_0.geometry} material={materials['Material.004']} position={[0.033, -88.745, 20.554]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Cylinder008_Material007_0.geometry} material={materials['Material.007']} position={[0, 2.006, 95.854]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={62.423} />
    </group>
  )
}

useGLTF.preload('/microphone.glb')
