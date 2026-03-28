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
  const isHomelander = modelPath.toLowerCase().includes("homelander");

  // --- STEP 2: LOAD MODEL SAFELY ---
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, groupRef);

  // --- STEP 3: FIX LESLEY (NOT SHOWING) ---
  useEffect(() => {
    if (!scene || !isLesley) return;

    console.log("Fixing Lesley model");

    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
      }
    });

  }, [scene, isLesley]);

  // --- STEP 4: COMMON BOUNDING BOX CALCULATION ---
  useEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);

    if (!box || box.isEmpty()) {
      console.warn("Invalid bounding box:", modelPath);
      return;
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);

    if (!isFinite(maxDim) || maxDim === 0) return;

    let scale = 2 / maxDim;

    // --- STEP 5: FIX HOMELANDER SCALE ONLY ---
    if (isHomelander) {
      scale = scale * 0.75; // make him smaller
    }

    scene.scale.setScalar(scale);

    // recalculate after scaling
    box.setFromObject(scene);

    const minY = box.min.y;
    const newCenter = new THREE.Vector3();
    box.getCenter(newCenter);

    scene.position.x = -newCenter.x;
    scene.position.z = -newCenter.z;
    scene.position.y = -minY;

  }, [scene, isHomelander, modelPath]);

  // Play first animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.play();
    }
  }, [actions]);

  // --- STEP 6: FALLBACK ONLY FOR LESLEY ---
  if (!scene && isLesley) {
    return (
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // --- STEP 7: RENDER NORMALLY ---
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

