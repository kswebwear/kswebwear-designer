"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { composite } from "@/lib/textureCompositor";
import { TEXTURE_SIZE } from "@/lib/constants";
import type { ActiveView } from "@/types/designer";

/**
 * Manages a persistent 2048×2048 canvas and a Three.js CanvasTexture.
 * Uses useState so parent re-renders when the texture is first created,
 * ensuring TShirtModel receives the texture immediately after mount.
 */
export function useCanvasTexture(
  baseColor: string,
  designImageURL: string | null,
  activeView: ActiveView
): THREE.CanvasTexture | null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Use state (not ref) so parent re-renders when texture is first created
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const rafRef = useRef<number>(0);

  // Initialize canvas and CanvasTexture once on mount
  useEffect(() => {
    if (canvasRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    setTexture(tex);
  }, []);

  // Re-composite whenever inputs or texture itself changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !texture) return;

    let cancelled = false;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(async () => {
      if (cancelled) return;
      await composite(canvas, baseColor, designImageURL, activeView);
      if (cancelled) return;
      texture.needsUpdate = true;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [baseColor, designImageURL, activeView, texture]);

  return texture;
}
