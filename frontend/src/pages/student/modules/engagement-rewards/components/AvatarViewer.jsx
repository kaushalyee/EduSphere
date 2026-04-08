import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Component } from "react";
import Avatar from "./Avatar";

function AvatarLoadingFallback() {
  return (
    <Html center>
      <div className="rounded bg-white/70 px-3 py-2 text-xs text-gray-900 shadow-sm border border-gray-200">
        Loading avatar...
      </div>
    </Html>
  );
}

function AvatarErrorFallback({ error, model }) {
  return (
    <Html center>
      <div className="max-w-[220px] rounded bg-white/80 px-3 py-2 text-center text-xs text-red-600 shadow-sm border border-red-200">
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
      <div className="relative w-[400px] h-[500px] md:w-[500px] md:h-[600px] bg-white rounded-3xl p-4 md:p-6 shadow-md border border-gray-100">
        {/* Avatar Card */}
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center overflow-hidden border border-gray-200/50">
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
          className={`game-arrow left ${index === 0 ? "disabled opacity-50" : "cursor-pointer"}`} 
          onClick={onPrev}
          aria-label="Previous Avatar"
          style={{ position: 'absolute', top: '50%', left: '-20px', transform: 'translateY(-50%)', zIndex: 10 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 hover:scale-105 transition-all text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
        </div>

        {/* Right Arrow */}
        <div 
          className={`game-arrow right ${index === total - 1 ? "disabled opacity-50" : "cursor-pointer"}`} 
          onClick={onNext}
          aria-label="Next Avatar"
          style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', zIndex: 10 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 hover:scale-105 transition-all text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>

      </div>
    </div>
  );
}
