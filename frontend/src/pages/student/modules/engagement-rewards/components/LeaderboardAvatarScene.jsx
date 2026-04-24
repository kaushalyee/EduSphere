import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, Stage, Environment, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const GLB_BASE_PATH = "/assets/avatars/optimized/";

/**
 * GlowBeam Component
 * Creates a soft vertical light beam behind characters.
 */
function GlowBeam({ color, position }) {
  return (
    <mesh position={[position[0], 1.5, -0.6]}>
      <planeGeometry args={[1.8, 4.5]} />
      <meshBasicMaterial
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      >
        <canvasTexture
          attach="map"
          image={(function() {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 256;
            const ctx = canvas.getContext("2d");
            const grad = ctx.createRadialGradient(64, 128, 0, 64, 128, 128);
            grad.addColorStop(0, color);
            grad.addColorStop(0.3, color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 256);
            return canvas;
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

/**
 * PodiumModel Component
 * Handles safe cloning, normalization, and animation for each companion.
 */
function PodiumModel({ path, position, scaleBoost = 1, rank = 1 }) {
  const { scene, animations } = useGLTF(`${GLB_BASE_PATH}${path}`);
  const groupRef = React.useRef();

  // Safe Cloning: Clone the scene to avoid skeleton conflicts between multiple models
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Animation System: Play first available animation
  const mixer = useMemo(() => new THREE.AnimationMixer(clonedScene), [clonedScene]);

  // Transform Reset and Animation Play
  useEffect(() => {
    if (!clonedScene) return;

    // Hard reset all transforms to prevent accumulation after navigation
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    if (animations && animations.length > 0) {
      const action = mixer.clipAction(animations[0]);
      action.reset(); // Crucial to prevent stacking
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(clonedScene);
    };
  }, [animations, mixer, clonedScene]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  // Normalize Scale: Calculate bounding box and scale to consistent visual height
  const yOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const targetHeight = 2.8; // Larger base for the zoomed camera
    const scale = (targetHeight / size.y) * scaleBoost;

    clonedScene.scale.set(scale, scale, scale);

    // Ground Alignment Offset (ensures feet at exactly y=0)
    return -box.min.y * scale;
  }, [clonedScene, scaleBoost]);

  // Rank-based Glow Color
  const glowColor = useMemo(() => {
    if (rank === 1) return "#fbbf24"; // Gold
    if (rank === 2) return "#cbd5e1"; // Silver
    if (rank === 3) return "#b45309"; // Bronze
    return "#3b82f6"; // Default
  }, [rank]);

  return (
    <group position={[position[0], 0, position[2]]} ref={groupRef}>
      {/* Soft Shadow under each character */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="black" transparent opacity={0.15} />
      </mesh>

      {/* Rank-based Glow Effect */}
      <group position={[0, 1.5, -0.8]}>
        <pointLight intensity={rank === 1 ? 20 : 10} distance={4} color={glowColor} />
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[1.0, 1.6, 64]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <primitive object={clonedScene} position={[0, yOffset, 0]} />
    </group>
  );
}

export default function LeaderboardAvatarScene({ topPlayers = [] }) {
  // Mapping system: Case-insensitive name to GLB path
  const getCompanionPath = (name) => {
    if (!name) return "robot.glb";
    const mapping = {
      robot: "robot.glb",
      gwen: "gwen.glb",
      superman: "superman.glb",
      hulk: "hulk.glb",
      batman: "batman.glb",
      layla: "layla.glb",
      lesley: "lesley.glb",
      iron_spider: "iron_spider.glb",
    };
    return mapping[name.toLowerCase()] || "robot.glb";
  };

  // Map backend topPlayers to the 3D scene positions
  // We expect topPlayers[0] = Rank 1, topPlayers[1] = Rank 2, topPlayers[2] = Rank 3
  const models = [
    { 
      name: getCompanionPath(topPlayers[1]?.activeCompanion), 
      position: [-2.5, 0, 0], 
      scaleBoost: 1.3, 
      rank: 2, 
      color: "#cbd5e1" 
    },
    { 
      name: getCompanionPath(topPlayers[0]?.activeCompanion), 
      position: [0, 0, 0], 
      scaleBoost: 1.35, 
      rank: 1, 
      color: "#fbbf24" 
    },
    { 
      name: getCompanionPath(topPlayers[2]?.activeCompanion), 
      position: [2.5, 0, 0], 
      scaleBoost: 1.3, 
      rank: 3, 
      color: "#b45309" 
    }
  ];

  return (
    <div className="w-full h-[450px] relative">
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.5, 8], fov: 30 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 5, 5]} intensity={1.2} />

          {/* Glow Beams (Layer 2) */}
          {models.map((m) => (
            <GlowBeam key={`beam-${m.rank}`} color={m.color} position={m.position} />
          ))}

          {/* Characters (Layer 3) */}
          {models.map((m) => (
            <PodiumModel
              key={`model-${m.rank}-${m.name}`}
              path={m.name}
              position={m.position}
              scaleBoost={m.scaleBoost}
              rank={m.rank}
            />
          ))}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1.2, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
