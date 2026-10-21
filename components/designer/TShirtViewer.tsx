"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TShirtModel } from "@/components/designer/TShirtModel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { ActiveView } from "@/types/designer";

interface TShirtViewerProps {
  baseColor: string;
  designImageURL: string | null;
  activeView: ActiveView;
  onModelLoaded?: () => void;
}

function Lights() {
  return (
    <>
      {/* Key light — warm from upper-right */}
      <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.1} shadow-camera-far={20}
        shadow-camera-left={-3} shadow-camera-right={3}
        shadow-camera-top={3} shadow-camera-bottom={-3}
      />
      {/* Fill light — cool from upper-left */}
      <directionalLight position={[-3, 3, -2]} intensity={0.5} />
      {/* Rim light — from behind */}
      <directionalLight position={[0, 1, -4]} intensity={0.3} color="#c8d8f0" />
      {/* Ambient — soft overall fill */}
      <ambientLight intensity={0.55} />
      {/* Subtle hemisphere: sky blue top, warm ground */}
      <hemisphereLight args={["#d0e8ff", "#f0e8d8", 0.4]} />
    </>
  );
}

export function TShirtViewer({
  baseColor,
  designImageURL,
  activeView,
  onModelLoaded,
}: TShirtViewerProps) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0.1, 2.8], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#f4f5f7"]} />

          <Lights />

          <Suspense fallback={null}>
            <TShirtModel
              baseColor={baseColor}
              designImageURL={designImageURL}
              activeView={activeView}
              onLoaded={onModelLoaded}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.8}
            maxDistance={4.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            minAzimuthAngle={-Math.PI / 5}
            maxAzimuthAngle={Math.PI / 5}
            makeDefault
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
