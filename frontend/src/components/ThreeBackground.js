import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';

const FloatingLeaves = () => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  // Create a few simple leaf-like geometries
  return (
    <group ref={groupRef}>
      {[...Array(15)].map((_, i) => (
        <Float 
          key={i} 
          speed={1.5} 
          rotationIntensity={2} 
          floatIntensity={2}
          position={[
            (Math.random() - 0.5) * 15, 
            (Math.random() - 0.5) * 15, 
            (Math.random() - 0.5) * 10 - 5
          ]}
        >
          <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <coneGeometry args={[0.3, 1, 3]} />
            <meshStandardMaterial color="#22c55e" opacity={0.6} transparent />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#dcfce7" />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <FloatingLeaves />
    </Canvas>
  );
};

export default ThreeBackground;
