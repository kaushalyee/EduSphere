import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Configure Draco loader decoder path
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

export default function Avatar({ model }) {
  const groupRef = useRef();
  
  // --- STEP 1: DETECT MODEL NAME ---
  const getAvatarPath = (file) => `/assets/avatars/optimized/${file}`;
  const modelPath = getAvatarPath(model);
  const isLesley = modelPath.toLowerCase().includes("lesley");

  // --- STEP 2: LOAD MODEL SAFELY ---
  let gltfData = { scene: null, animations: [] };
  try {
    gltfData = useGLTF(modelPath);
  } catch (e) {
    if (e instanceof Promise) throw e; // Let suspense handle the promise
    console.error("GLB load failed:", modelPath, e);
  }
  
  const { scene, animations } = gltfData;
  const { actions } = useAnimations(animations, groupRef);

  const isSpecial = isLesley || modelPath.toLowerCase().includes("gwen") || modelPath.toLowerCase().includes("spider") || modelPath.toLowerCase().includes("robot");

  // --- STEP 3: FIX VISIBILITY & MATERIALS ---
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;
        // Apply double side to special cases or all if troubleshooting
        if (isSpecial) {
          child.material = child.material.clone();
          child.material.side = THREE.DoubleSide;
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      }
    });

  }, [scene, isSpecial]);

  // --- STEP 4: APPLY SPECIFIC SCALE AND POSITION ---
  useEffect(() => {
    if (!scene) return;

    // Detect oversized models (Hulk & Superman)
    const isOversized = modelPath.toLowerCase().includes("hulk") || modelPath.toLowerCase().includes("superman");
    
    // Apply conditional scale (Reduce oversized models by ~12.5%)
    const modelScale = isOversized ? 1.4 : 1.6;

    scene.scale.set(modelScale, modelScale, modelScale);
    scene.position.set(0, -1.3, 0);

  }, [scene, modelPath]);

  // Play first animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.play();
    }
  }, [actions]);

  // Fallback for loading states / failures
  if (!scene) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="gray" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload large companion models to improve first-view performance
useGLTF.preload('/assets/avatars/optimized/robot.glb');
useGLTF.preload('/assets/avatars/optimized/layla.glb');
useGLTF.preload('/assets/avatars/optimized/batman.glb');
useGLTF.preload('/assets/avatars/optimized/gwen.glb');
useGLTF.preload('/assets/avatars/optimized/superman.glb');
useGLTF.preload('/assets/avatars/optimized/hulk.glb');
useGLTF.preload('/assets/avatars/optimized/lesley.glb');
useGLTF.preload('/assets/avatars/optimized/iron_spider.glb');
