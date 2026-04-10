import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Component } from "react";
import { useThree } from "@react-three/fiber";
import Avatar from "./Avatar";

function AvatarLoadingFallback() {
  return (
    <Html center>
      <div className="rounded bg-black/40 px-3 py-2 text-xs text-white shadow-sm border border-purple-500/30 backdrop-blur-md">
        Loading companion...
      </div>
    </Html>
  );
}

function AvatarErrorFallback({ error, model }) {
  return (
    <Html center>
      <div className="max-w-[220px] rounded bg-red-900/40 px-3 py-2 text-center text-xs text-red-200 shadow-sm border border-red-500/30 backdrop-blur-md">
        Failed to load companion{model ? `: ${model}` : ""}.
        {error?.message ? ` ${error.message}` : ""}
      </div>
    </Html>
  );
}

class AvatarErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error("Avatar failed to load:", this.props.model, error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model !== this.props.model && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return <AvatarErrorFallback error={this.state.error} model={this.props.model} />;
    }

    return this.props.children;
  }
}

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.0, 3.5);
    camera.fov = 50;
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/**
 * AvatarViewer Component - Zoomed Framing
 */
export default function AvatarViewer({ modelPath: model }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center avatar-viewer">
      <Canvas 
        camera={{ position: [0, 1.0, 3.5], fov: 50 }} 
        shadows
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <CameraSetup />
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#a78bfa" />

        <AvatarErrorBoundary model={model}>
          <Suspense fallback={<AvatarLoadingFallback />}>
            <Avatar key={model} model={model} />
          </Suspense>
        </AvatarErrorBoundary>

        <OrbitControls 
          enableZoom={false} 
          target={[0, 0.4, 0]} 
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
