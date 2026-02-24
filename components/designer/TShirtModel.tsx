"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ActiveView } from "@/types/designer";

interface TShirtModelProps {
  canvasTexture: THREE.CanvasTexture | null;
  activeView: ActiveView;
  onLoaded?: () => void;
}

// Preload the GLB as soon as the module loads
useGLTF.preload("/models/tshirt.glb");

export function TShirtModel({ canvasTexture, activeView, onLoaded }: TShirtModelProps) {
  const { scene } = useGLTF("/models/tshirt.glb");
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const loadedRef = useRef(false);

  // Apply canvas texture to all mesh materials in the GLB
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Create or reuse a MeshStandardMaterial
        if (!materialRef.current) {
          materialRef.current = new THREE.MeshStandardMaterial({
            roughness: 0.82,
            metalness: 0.0,
            side: THREE.FrontSide,
          });
        }
        child.material = materialRef.current;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (!loadedRef.current) {
      loadedRef.current = true;
      onLoaded?.();
    }
  }, [scene, onLoaded]);

  // Update texture on the material whenever canvasTexture changes
  useEffect(() => {
    if (!materialRef.current || !canvasTexture) return;
    materialRef.current.map = canvasTexture;
    materialRef.current.needsUpdate = true;
  }, [canvasTexture]);

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
    </group>
  );
}
