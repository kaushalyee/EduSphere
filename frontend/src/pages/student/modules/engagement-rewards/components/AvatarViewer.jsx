import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Component } from "react";
import { useThree } from "@react-three/fiber";
import Avatar from "./Avatar";

function AvatarLoadingFallback() {
  return (
    <Html center>
      <div className="rounded bg-black/40 px-3 py-1 text-[10px] text-white backdrop-blur-md">
        Loading...
      </div>
    </Html>
  );
}

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Zoomed out to ensure full model visibility
    camera.position.set(0, 1.2, 5.5);
    camera.fov = 40;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export default function AvatarViewer({ modelPath: model }) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-visible">
      <Canvas 
        camera={{ position: [0, 1.2, 5.5], fov: 40 }} 
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <CameraSetup />
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, 5, 5]} intensity={0.8} color="#a78bfa" />
        <directionalLight position={[0, 5, 5]} intensity={1.0} />

        <Suspense fallback={<AvatarLoadingFallback />}>
          <Avatar key={model} model={model} />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enableRotate={false}
          enablePan={false}
          target={[0, 0, 0]} 
        />
      </Canvas>
    </div>
  );
}
