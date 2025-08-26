import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDPreviewProps {
  modelType?: 'dragon' | 'vase' | 'phone-stand' | 'lamp' | 'organizer';
  color?: string;
  autoRotate?: boolean;
  className?: string;
}

function DragonModel({ color = '#666666' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const geometry = useMemo(() => {
    // Create a more complex dragon-like shape
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8);
    const bodyMesh = new THREE.Mesh(bodyGeometry, new THREE.MeshStandardMaterial({ color }));
    bodyMesh.rotation.z = Math.PI / 6;
    group.add(bodyMesh);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 8, 6);
    const headMesh = new THREE.Mesh(headGeometry, new THREE.MeshStandardMaterial({ color }));
    headMesh.position.set(0.8, 0.5, 0);
    group.add(headMesh);
    
    // Wings
    const wingGeometry = new THREE.ConeGeometry(0.8, 1.2, 4);
    const leftWing = new THREE.Mesh(wingGeometry, new THREE.MeshStandardMaterial({ color }));
    leftWing.position.set(-0.2, 0.2, 0.8);
    leftWing.rotation.z = Math.PI / 4;
    group.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, new THREE.MeshStandardMaterial({ color }));
    rightWing.position.set(-0.2, 0.2, -0.8);
    rightWing.rotation.z = -Math.PI / 4;
    group.add(rightWing);
    
    return group;
  }, [color]);

  return <primitive ref={meshRef} object={geometry} />;
}

function VaseModel({ color = '#888888' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.6, 0.8, 1.5, 6]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function PhoneStandModel({ color = '#444444' }: { color?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Back support */}
      <mesh position={[0, 0, -0.3]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1, 1.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Front lip */}
      <mesh position={[0, -0.3, 0.3]}>
        <boxGeometry args={[1, 0.1, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function DefaultModel({ color = '#666666' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function ThreeDPreview({ 
  modelType = 'dragon', 
  color = '#666666', 
  autoRotate = true, 
  className = '' 
}: ThreeDPreviewProps) {
  const renderModel = () => {
    switch (modelType) {
      case 'dragon':
        return <DragonModel color={color} />;
      case 'vase':
        return <VaseModel color={color} />;
      case 'phone-stand':
        return <PhoneStandModel color={color} />;
      default:
        return <DefaultModel color={color} />;
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[2, 2, 5]} />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={3}
          maxDistance={10}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        <pointLight
          position={[-5, 5, 5]}
          intensity={0.5}
          color="#6366f1"
        />
        <pointLight
          position={[5, -5, -5]}
          intensity={0.3}
          color="#8b5cf6"
        />
        
        {renderModel()}
      </Canvas>
    </div>
  );
}