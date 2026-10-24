"use client";

import { Suspense, useRef, useState } from "react";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TShirtModel } from "@/components/designer/TShirtModel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { ActiveView, SideLayers } from "@/types/designer";

interface TShirtViewerProps {
  baseColor: string;
  layers: Record<ActiveView, SideLayers>;
  activeView: ActiveView;
  onModelLoaded?: () => void;
}

const EXPORT_FORMATS = [
  { label: "PNG", mime: "image/png", ext: "png" },
  { label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { label: "WebP", mime: "image/webp", ext: "webp" },
] as const;

type Exporter = (mime: string) => Promise<Blob | null>;

// Re-renders the current view without editing handles and reads the canvas back
function ExportBridge({ exporterRef }: { exporterRef: React.MutableRefObject<Exporter | null> }) {
  const { gl, scene, camera } = useThree();
  exporterRef.current = (mime) => {
    const hidden: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (o.userData.editorOnly && o.visible) {
        o.visible = false;
        hidden.push(o);
      }
    });
    gl.render(scene, camera);
    return new Promise((resolve) => {
      gl.domElement.toBlob(
        (blob) => {
          hidden.forEach((o) => (o.visible = true));
          resolve(blob);
        },
        mime,
        0.95
      );
    });
  };
  return null;
}

const MIN_DISTANCE = 1.8;
const MAX_DISTANCE = 5;

function Lights() {
  return (
    <>
      {/* Key light — warm from upper-right */}
      <directionalLight position={[3, 5, 3]} intensity={2.0} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.1} shadow-camera-far={20}
        shadow-camera-left={-3} shadow-camera-right={3}
        shadow-camera-top={3} shadow-camera-bottom={-3}
      />
      {/* Fill light — cool from upper-left */}
      <directionalLight position={[-3, 3, -2]} intensity={0.8} />
      {/* Rim light — from behind */}
      <directionalLight position={[0, 1, -4]} intensity={0.3} color="#c8d8f0" />
      {/* Ambient — soft overall fill */}
      <ambientLight intensity={1.1} />
      {/* Subtle hemisphere: sky blue top, warm ground */}
      <hemisphereLight args={["#d0e8ff", "#f0e8d8", 0.4]} />
    </>
  );
}

export function TShirtViewer({
  baseColor,
  layers,
  activeView,
  onModelLoaded,
}: TShirtViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const exporterRef = useRef<Exporter | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const download = async (format: (typeof EXPORT_FORMATS)[number]) => {
    setMenuOpen(false);
    const blob = await exporterRef.current?.(format.mime);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kswebwear-tshirt-${activeView}.${format.ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const zoom = (factor: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const offset = controls.object.position.clone().sub(controls.target);
    const distance = Math.min(MAX_DISTANCE, Math.max(MIN_DISTANCE, offset.length() * factor));
    controls.object.position.copy(controls.target).add(offset.setLength(distance));
    controls.update();
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#2b2d3a]">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 3.6], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#2b2d3a"]} />

          <ExportBridge exporterRef={exporterRef} />
          <Lights />

          <Suspense fallback={null}>
            <TShirtModel
              baseColor={baseColor}
              layers={layers}
              activeView={activeView}
              onLoaded={onModelLoaded}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={MIN_DISTANCE}
            maxDistance={MAX_DISTANCE}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            minAzimuthAngle={-Math.PI / 5}
            maxAzimuthAngle={Math.PI / 5}
            makeDefault
          />
        </Canvas>
      </ErrorBoundary>
      <div className="absolute bottom-4 right-4 z-10">
        {menuOpen && (
          <div className="absolute bottom-12 right-0 w-28 rounded-2xl bg-black/80 backdrop-blur border border-white/10 p-1">
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format.ext}
                onClick={() => download(format)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-inter text-white/80 hover:bg-white/10 hover:text-white"
              >
                {format.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Download image"
          aria-expanded={menuOpen}
          className="h-10 px-3 sm:px-4 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur border border-white/10 text-sm font-inter text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {[
          { label: "Zoom in", Icon: ZoomIn, factor: 0.8 },
          { label: "Zoom out", Icon: ZoomOut, factor: 1.25 },
        ].map(({ label, Icon, factor }) => (
          <button
            key={label}
            onClick={() => zoom(factor)}
            aria-label={label}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
