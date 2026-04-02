import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function MedicalCross() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Horizontal bar */}
            <mesh castShadow>
                <boxGeometry args={[3, 1, 1]} />
                <meshStandardMaterial color="#0d9488" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Vertical bar */}
            <mesh castShadow>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="#0d9488" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Inner Glow */}
            <mesh scale={[3.1, 1.1, 1.1]}>
                <boxGeometry />
                <meshBasicMaterial color="#2dd4bf" transparent opacity={0.1} />
            </mesh>
            <mesh scale={[1.1, 3.1, 1.1]}>
                <boxGeometry />
                <meshBasicMaterial color="#2dd4bf" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

function Particles({ count = 100 }) {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#0d9488" size={0.05} transparent opacity={0.4} sizeAttenuation />
        </points>
    );
}

export default function Scene3D() {
    return (
        <div className="w-full h-full">
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <MedicalCross />
                </Float>

                <Sphere args={[1, 32, 32]} position={[4, 2, -5]}>
                    <MeshDistortMaterial color="#3b82f6" speed={3} distort={0.4} radius={1} />
                </Sphere>

                <Particles />
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}

