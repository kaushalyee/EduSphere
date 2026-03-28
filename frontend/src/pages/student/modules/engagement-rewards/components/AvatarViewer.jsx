import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Component } from "react";
import Avatar from "./Avatar";

function AvatarLoadingFallback() {
  return (
    <Html center>
      <div className="rounded bg-black/70 px-3 py-2 text-xs text-white">
        Loading avatar...
      </div>
    </Html>
  );
}

function AvatarErrorFallback({ error, model }) {
  return (
    <Html center>
      <div className="max-w-[220px] rounded bg-black/80 px-3 py-2 text-center text-xs text-white">
        Failed to load avatar{model ? `: ${model}` : ""}.
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

/**
 * AvatarViewer Component
 * @param {Object} props
 * @param {string} props.modelPath - The path to the GLB model
 * @param {Function} props.onNext - Handler for next avatar
 * @param {Function} props.onPrev - Handler for previous avatar
 * @param {number} props.index - Current avatar index
 * @param {number} props.total - Total number of avatars
 */
export default function AvatarViewer({ modelPath: model, onNext, onPrev, index, total }) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
      <div className="relative w-[400px] h-[500px] md:w-[500px] md:h-[600px]">
        {/* Avatar Card */}
        <div className="w-full h-full rounded-3xl bg-gradient-to-b from-blue-500/20 to-slate-900 shadow-2xl flex items-center justify-center overflow-hidden border border-white/5">
          <Canvas camera={{ position: [0, 1.2, 4], fov: 40 }} shadows>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 5, 5]} intensity={1.5} />

            <AvatarErrorBoundary model={model}>
              <Suspense fallback={<AvatarLoadingFallback />}>
                <Avatar
                  key={model}
                  model={model}
                />
              </Suspense>
            </AvatarErrorBoundary>

            <OrbitControls 
              enableZoom={false} 
              target={[0, 1.25, 0]} 
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </div>

        {/* Left Arrow */}
        <div 
          className={`game-arrow left ${index === 0 ? "disabled" : ""}`} 
          onClick={onPrev}
          aria-label="Previous Avatar"
        >
          <div className="arrow">
            <div className="arrow-top"></div>
            <div className="arrow-bottom"></div>
          </div>
        </div>

        {/* Right Arrow */}
        <div 
          className={`game-arrow right ${index === total - 1 ? "disabled" : ""}`} 
          onClick={onNext}
          aria-label="Next Avatar"
        >
          <div className="arrow">
            <div className="arrow-top"></div>
            <div className="arrow-bottom"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
