"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { ActiveView } from "@/types/designer";

interface TShirtModelProps {
  baseColor: string;
  designImageURL: string | null;
  activeView: ActiveView;
  onLoaded?: () => void;
}

// Print area, in model units (shirt is ~1.8 wide, ~1.9 tall)
const PRINT_WIDTH = 0.7;
const PRINT_MAX_HEIGHT = 0.8;
const PRINT_CENTER_Y = 0.2;
const SURFACE_OFFSET = 0.004;

const MAX_TEXTURE_EDGE = 2048;
const FALLBACK_EDGE = 1024;

useGLTF.preload("/models/tshirt.glb");

// Rasterise to a canvas so SVGs without width/height (natural size 0) still render
function useDesignTexture(url: string) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (!w || !h) {
        w = FALLBACK_EDGE;
        h = FALLBACK_EDGE;
      }
      const scale = Math.min(1, MAX_TEXTURE_EDGE / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      created = new THREE.CanvasTexture(canvas);
      created.colorSpace = THREE.SRGBColorSpace;
      created.anisotropy = 8;
      setTexture(created);
    };
    img.src = url;
    return () => {
      cancelled = true;
      setTexture(null);
      created?.dispose();
    };
  }, [url]);

  return texture;
}

function DesignPlane({
  url,
  shirt,
  side,
}: {
  url: string;
  shirt: THREE.Object3D;
  side: ActiveView;
}) {
  const texture = useDesignTexture(url);
  const dir = side === "front" ? 1 : -1;

  // Find where the shirt surface sits at the print centre so the plane hugs it
  const z = useMemo(() => {
    const ray = new THREE.Raycaster(
      new THREE.Vector3(0, PRINT_CENTER_Y, dir * 3),
      new THREE.Vector3(0, 0, -dir)
    );
    const hit = ray.intersectObject(shirt, true)[0];
    return (hit ? hit.point.z : dir * 0.3) + dir * SURFACE_OFFSET;
  }, [shirt, dir]);

  if (!texture) return null;

  const img = texture.image as { width: number; height: number };
  const aspect = img.width / img.height;
  const width = Math.min(PRINT_WIDTH, PRINT_MAX_HEIGHT * aspect);
  const height = width / aspect;

  return (
    <mesh position={[0, PRINT_CENTER_Y, z]} rotation={[0, side === "back" ? Math.PI : 0, 0]} renderOrder={1}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.05} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export function TShirtModel({ baseColor, designImageURL, activeView, onLoaded }: TShirtModelProps) {
  const { scene } = useGLTF("/models/tshirt.glb");
  const groupRef = useRef<THREE.Group>(null);
  const loadedRef = useRef(false);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, side: THREE.DoubleSide }),
    []
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.updateMatrixWorld(true);

    if (!loadedRef.current) {
      loadedRef.current = true;
      onLoaded?.();
    }
  }, [scene, material, onLoaded]);

  useEffect(() => {
    material.color.set(baseColor);
  }, [material, baseColor]);

  // Rotate the group to show front vs back
  useEffect(() => {
    if (!groupRef.current) return;
    const targetY = activeView === "back" ? Math.PI : 0;
    const startY = groupRef.current.rotation.y;
    const duration = 500; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out cubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (groupRef.current) {
        groupRef.current.rotation.y = startY + (targetY - startY) * ease;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [activeView]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {designImageURL && (
        <DesignPlane url={designImageURL} shirt={scene} side={activeView} />
      )}
    </group>
  );
}
