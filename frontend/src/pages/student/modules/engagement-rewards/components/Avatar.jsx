import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Configure Draco loader decoder path
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

export default function Avatar({ model }) {
  const groupRef = useRef();
  
  // --- STEP 1: DETECT MODEL NAME ---
  const modelPath = `/avatars/optimized/${model}`;
  const isLesley = modelPath.toLowerCase().includes("lesley");

  // --- STEP 2: LOAD MODEL SAFELY ---
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, groupRef);

  // --- STEP 3: FIX LESLEY VISIBILITY ---
  useEffect(() => {
    if (!scene || !isLesley) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
      }
    });

  }, [scene, isLesley]);

  // --- STEP 4: APPLY SPECIFIC SCALE AND POSITION ---
  useEffect(() => {
    if (!scene) return;

    scene.scale.set(1.2, 1.2, 1.2);

    scene.position.set(0, -0.9, 0);

  }, [scene]);

  // Play first animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.play();
    }
  }, [actions]);

  // Fallback for loading states / failures
  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
