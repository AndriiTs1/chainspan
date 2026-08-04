"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Stars } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function Core({ reduceMotion }: { reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // The continuous rotation/pointer-parallax is the most prominent motion
    // on the page, so it's the one piece prefers-reduced-motion must stop -
    // framer-motion's MotionConfig can't reach into react-three-fiber's own
    // render loop, hence the manual gate here.
    if (reduceMotion) return;

    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.08;

    const pointerX = state.pointer.x * 0.15;
    const pointerY = state.pointer.y * 0.1;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointerX,
      0.03,
    );

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointerY,
      0.03,
    );
  });

  return (
    <group ref={groupRef}>
      <Icosahedron args={[2.15, 5]}>
        <meshPhysicalMaterial
          color="#071225"
          metalness={0.8}
          roughness={0.12}
          transmission={0.16}
          thickness={1.5}
          transparent
          opacity={0.88}
        />
      </Icosahedron>

      <Icosahedron args={[2.2, 3]}>
        <meshBasicMaterial
          color="#4895ff"
          wireframe
          transparent
          opacity={0.22}
        />
      </Icosahedron>

      <Icosahedron args={[1.45, 2]}>
        <meshBasicMaterial
          color="#7c4dff"
          wireframe
          transparent
          opacity={0.28}
        />
      </Icosahedron>

      <pointLight position={[2, 2, 3]} intensity={18} color="#3b82f6" />
      <pointLight position={[-3, -1, 2]} intensity={14} color="#7c3aed" />
    </group>
  );
}

function FloatingObject({
  position,
  scale,
  color,
  reduceMotion,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  reduceMotion: boolean;
}) {
  return (
    <Float
      speed={reduceMotion ? 0 : 1.4}
      rotationIntensity={reduceMotion ? 0 : 1.2}
      floatIntensity={reduceMotion ? 0 : 1.4}
      position={position}
    >
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.18}
          transmission={0.1}
        />
      </mesh>
    </Float>
  );
}

export function ChainSpanScene() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />

        <Core reduceMotion={reduceMotion} />

        <FloatingObject
          position={[-4.4, 2.1, -1]}
          scale={0.34}
          color="#2563eb"
          reduceMotion={reduceMotion}
        />
        <FloatingObject
          position={[4.3, 2.3, -1]}
          scale={0.45}
          color="#7c3aed"
          reduceMotion={reduceMotion}
        />
        <FloatingObject
          position={[-4.8, -2.2, -1]}
          scale={0.26}
          color="#4338ca"
          reduceMotion={reduceMotion}
        />
        <FloatingObject
          position={[4.9, -1.8, -1]}
          scale={0.3}
          color="#3b82f6"
          reduceMotion={reduceMotion}
        />

        <Stars
          radius={80}
          depth={40}
          count={900}
          factor={2}
          saturation={0}
          fade
          speed={reduceMotion ? 0 : 0.25}
        />
      </Canvas>
    </div>
  );
}
