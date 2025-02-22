import React from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from '../Microphone';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stage,
  AccumulativeShadows,
  RandomizedLight
} from "@react-three/drei";

function MircroModel() {
  const { scene } = useGLTF("../public/microphon.glb");
  return <primitive object={scene} scale={1.5} />;
}

const ModelViewer = () => {
  return (
    <div className="relative w-full h-[600px]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray to-gray" />
      
      {/* Custom border with glow effect */}
      <div className="absolute inset-0 p-1">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75" />
          
          {/* Canvas container */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-black">
            <Canvas
              shadows
              camera={{ position: [0, 2, 5], fov: 50 }}
              className="w-full h-full"
            >
              {/* Lighting */}
              <color attach="background" args={['#0a0a0a']} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 5, 2]} intensity={1} castShadow />
              
              {/* Environment and Stage */}
              <Environment preset="city" />
              <Stage
                environment="city"
                intensity={0.5}
                shadows={{ type: 'contact', opacity: 0.2, blur: 3 }}
              >
                <Model />
              </Stage>

              {/* Shadows */}
              <AccumulativeShadows
                position={[0, -0.5, 0]}
                scale={10}
                color="#4b0082"
                opacity={0.3}
                frames={100}
                temporal
              >
                <RandomizedLight
                  amount={8}
                  radius={4}
                  ambient={0.5}
                  intensity={1}
                  position={[5, 5, -10]}
                  bias={0.001}
                />
              </AccumulativeShadows>

              {/* Controls with constraints */}
              <OrbitControls
                makeDefault
                minPolarAngle={Math.PI / 4}     // Limit bottom rotation
                maxPolarAngle={Math.PI / 1.5}    // Limit top rotation
                minDistance={3}                   // Minimum zoom
                maxDistance={6}                   // Maximum zoom
                enablePan={false}                 // Disable panning
                rotateSpeed={0.5}                 // Slow down rotation speed
                target={[0, 0, 0]}               // Center point
                enableDamping                     // Smooth camera movement
                dampingFactor={0.05}             // Damping speed
              />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Optional: Add interaction hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default ModelViewer;