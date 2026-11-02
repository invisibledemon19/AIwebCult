import React, { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Internal 3D Scene containing the Monolith & Pipeline geometry
 * with GSAP ScrollTrigger camera binding
 */
const MonolithPipeline = ({ onLoaded }) => {
  const { camera } = useThree();
  const monolithRef = useRef();
  const innerCubeRef = useRef();
  const conduitGroupRef = useRef();

  useEffect(() => {
    if (onLoaded) onLoaded();

    // Initial camera placement
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    // Deep ScrollTrigger binding: camera Z depth, Y position, and monolith rotation scrubbed to scroll
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8, // Crisp scrub, strictly mechanical
        },
      });

      // 1. Scrub camera depth and angle down the pipeline
      tl.to(
        camera.position,
        {
          z: 2.2,
          y: 1.2,
          x: 0.4,
          ease: "none",
        },
        0
      );

      // 2. Scrub Monolith complex rotation on scroll
      if (monolithRef.current) {
        tl.to(
          monolithRef.current.rotation,
          {
            x: Math.PI * 2,
            y: Math.PI * 3,
            z: Math.PI,
            ease: "none",
          },
          0
        );

        tl.to(
          monolithRef.current.position,
          {
            z: -4,
            y: -1.2,
            ease: "none",
          },
          0
        );
      }

      // 3. Scrub outer conduit ring rotation
      if (conduitGroupRef.current) {
        tl.to(
          conduitGroupRef.current.rotation,
          {
            z: Math.PI * 4,
            ease: "none",
          },
          0
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [camera, onLoaded]);

  // Baseline mechanical rotation
  useFrame((_, delta) => {
    if (monolithRef.current) {
      monolithRef.current.rotation.y += delta * 0.15;
    }
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.x -= delta * 0.25;
      innerCubeRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <>
      {/* Stark directional lighting without soft atmospheric haze */}
      <ambientLight intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[10, 20, 15]} intensity={2.0} color="#00FF41" />

      {/* Cybernetic Infinite Ground Grid */}
      <gridHelper args={[70, 70, "#00FF41", "#222222"]} position={[0, -3.5, 0]} />

      {/* Central Brutalist Monolith Polyhedron */}
      <group ref={monolithRef} position={[0, 0, 0]}>
        {/* Outer wireframe octahedron in Terminal Green */}
        <mesh>
          <octahedronGeometry args={[2.3, 0]} />
          <meshBasicMaterial
            wireframe
            color="#00FF41"
            wireframeLinewidth={1.5}
          />
        </mesh>

        {/* Inner solid black shell to occlude background wires */}
        <mesh>
          <octahedronGeometry args={[2.28, 0]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Core Wireframe Cube */}
        <mesh ref={innerCubeRef}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial
            wireframe
            color="#FFFFFF"
            wireframeLinewidth={1.0}
          />
        </mesh>
      </group>

      {/* Data Pipeline Conduit Rings */}
      <group ref={conduitGroupRef} position={[0, 0, 0]}>
        {[-10, -6, -2, 2, 6, 10].map((zPos, idx) => (
          <mesh key={idx} position={[0, 0, zPos]}>
            <torusGeometry args={[4.4, 0.025, 4, 32]} />
            <meshBasicMaterial
              wireframe
              color={idx % 2 === 0 ? "#00FF41" : "#FFFFFF"}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

export const CanvasScene = ({ onLoaded }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 bg-[#000000]"
      style={{ borderRadius: "0px" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <MonolithPipeline onLoaded={onLoaded} />
      </Canvas>
    </div>
  );
};

export default CanvasScene;

