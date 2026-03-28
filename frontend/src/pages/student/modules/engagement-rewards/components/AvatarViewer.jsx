import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

function Model({ path, cameraOffset, heightOffset }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);
  const { camera } = useThree();

  // Play first animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.play();
    }
  }, [actions]);

  // Scale, center, and auto-fit camera to model
  useLayoutEffect(() => {
    // Reset transforms before measuring
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.updateMatrixWorld(true);

    // Measure original bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    // Normalize model to 2 units tall / wide
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    // Re-measure after scale to get accurate center
    scene.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = new THREE.Vector3();
    const scaledSize = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);
    scaledBox.getSize(scaledSize);

    // Center the model at origin
    scene.position.sub(scaledCenter);
    scene.updateMatrixWorld(true);

    // --- CAMERA POSITION ---
    // If per-avatar overrides are provided (e.g. Layla, Lesley), use them.
    // Otherwise fall back to the existing FOV-based auto-fit logic.
    let distance;
    let eyeHeight;

    if (cameraOffset !== undefined && heightOffset !== undefined) {
      // Manual override: scale relative to the normalised model size
      distance = scaledSize.y * cameraOffset;
      eyeHeight = scaledSize.y * heightOffset;
    } else {
      // Auto-fit: calculate minimum distance so the model fills the view
      const fov = camera.fov * (Math.PI / 180);
      const halfHeight = scaledSize.y / 2;
      const halfWidth  = scaledSize.x / 2;
      const distForHeight = halfHeight / Math.tan(fov / 2);
      const distForWidth  = halfWidth  / Math.tan((fov * camera.aspect) / 2);
      distance  = Math.max(distForHeight, distForWidth) * 1.3;
      eyeHeight = scaledSize.y * 0.1;
    }

    camera.position.set(0, eyeHeight, distance);
    camera.lookAt(0, 0, 0);
    camera.near = distance * 0.01;
    camera.far  = distance * 10;
    camera.updateProjectionMatrix();
  }, [scene, path, camera, cameraOffset, heightOffset]);

  // Gentle auto-rotate
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={group} object={scene} />;
}

export default function AvatarViewer({ modelPath, cameraOffset, heightOffset }) {
  return (
    <div className="flex h-[500px] w-[500px] items-center justify-center">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 2]} intensity={2} />

        <Suspense fallback={null}>
          <Model key={modelPath} path={modelPath} cameraOffset={cameraOffset} heightOffset={heightOffset} />
        </Suspense>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
