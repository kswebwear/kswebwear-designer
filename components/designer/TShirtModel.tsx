"use client";

import { useDesignerStore } from "@/store/designerStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { ActiveView, Layer, LayerKind, SideLayers } from "@/types/designer";
import { areaOf, clampCenter, layerWidth, maxFitWidth, maxWidthAround } from "@/lib/printArea";

interface TShirtModelProps {
  baseColor: string;
  layers: Record<ActiveView, SideLayers>;
  activeView: ActiveView;
  onLoaded?: () => void;
}

// Height at which the surface depth is sampled (shirt is ~1.8 wide, ~1.9 tall)
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

function PrintLayer({
  layer,
  kind,
  side,
  group,
  surfaceZ,
  interactive,
}: {
  layer: Layer;
  kind: LayerKind;
  side: ActiveView;
  group: THREE.Object3D;
  surfaceZ: number;
  interactive: boolean;
}) {
  const texture = useDesignTexture(layer.url);
  const updateLayer = useDesignerStore((s) => s.updateLayer);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls) as { enabled: boolean } | null;
  const dir = side === "front" ? 1 : -1;

  if (!texture) return null;

  const img = texture.image as { width: number; height: number };
  const aspect = img.width / img.height;
  const area = areaOf(layer.full);
  const width = layerWidth(layer.size, aspect, area);
  const height = width / aspect;
  const center = clampCenter(layer.x, layer.y, width, height, area);

  // Pointer position on the shirt surface, in screen terms (+x right, +y up)
  const pointerOnShirt = (ev: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, camera);
    group.updateWorldMatrix(true, false);
    const normal = new THREE.Vector3(0, 0, dir).transformDirection(group.matrixWorld);
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      normal,
      group.localToWorld(new THREE.Vector3(0, 0, surfaceZ))
    );
    const hit = ray.ray.intersectPlane(plane, new THREE.Vector3());
    if (!hit) return null;
    const local = group.worldToLocal(hit);
    return { x: dir * local.x, y: local.y };
  };

  const startDrag = (e: ThreeEvent<PointerEvent>, mode: "move" | "resize") => {
    if (!interactive) return;
    e.stopPropagation();
    const start = pointerOnShirt(e.nativeEvent);
    if (!start) return;
    const grab = { x: start.x - center.x, y: start.y - center.y };
    if (controls) controls.enabled = false;

    const onMove = (ev: PointerEvent) => {
      const p = pointerOnShirt(ev);
      if (!p) return;
      if (mode === "move") {
        const next = clampCenter(p.x - grab.x, p.y - grab.y, width, height, area);
        updateLayer(side, kind, next);
        return;
      }
      const wanted = Math.max(2 * Math.abs(p.x - center.x), 2 * Math.abs(p.y - center.y) * aspect);
      const nextWidth = Math.min(wanted, maxWidthAround(center.x, center.y, aspect, area));
      updateLayer(side, kind, { size: nextWidth / maxFitWidth(aspect, area), ...center });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (controls) controls.enabled = true;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <group
      position={[dir * center.x, center.y, surfaceZ + dir * SURFACE_OFFSET]}
      rotation={[0, side === "back" ? Math.PI : 0, 0]}
    >
      <mesh
        renderOrder={kind === "logo" ? 2 : 1}
        onPointerDown={(e) => startDrag(e, "move")}
        onPointerOver={() => interactive && (gl.domElement.style.cursor = "move")}
        onPointerOut={() => (gl.domElement.style.cursor = "")}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.05} depthTest={false} depthWrite={false} />
      </mesh>
      {interactive && (
        <mesh
          position={[width / 2, -height / 2, 0.001]}
          renderOrder={3}
          userData={{ editorOnly: true }}
          onPointerDown={(e) => startDrag(e, "resize")}
          onPointerOver={() => (gl.domElement.style.cursor = "nwse-resize")}
          onPointerOut={() => (gl.domElement.style.cursor = "")}
        >
          <circleGeometry args={[0.03, 24]} />
          <meshBasicMaterial color="#e63946" depthTest={false} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function TShirtModel({ baseColor, layers, activeView, onLoaded }: TShirtModelProps) {
  const { scene } = useGLTF("/models/tshirt.glb");
  const groupRef = useRef<THREE.Group>(null);
  const loadedRef = useRef(false);
  const [surfaceZ, setSurfaceZ] = useState<Record<ActiveView, number> | null>(null);

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

    // Where the shirt surface sits at the print centre, in group-local z, so layers hug it
    const group = groupRef.current;
    if (group) {
      group.updateWorldMatrix(true, true);
      const measure = (dir: 1 | -1) => {
        const origin = group.localToWorld(new THREE.Vector3(0, PRINT_CENTER_Y, dir * 3));
        const heading = new THREE.Vector3(0, 0, -dir).transformDirection(group.matrixWorld);
        const hit = new THREE.Raycaster(origin, heading).intersectObject(scene, true)[0];
        return hit ? group.worldToLocal(hit.point.clone()).z : dir * 0.3;
      };
      setSurfaceZ({ front: measure(1), back: measure(-1) });
    }

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
      {surfaceZ &&
        groupRef.current &&
        (["front", "back"] as const).flatMap((side) =>
          (["design", "logo"] as const).flatMap((kind) => {
            const layer = layers[side][kind];
            return layer ? (
              <PrintLayer
                key={`${side}-${kind}`}
                layer={layer}
                kind={kind}
                side={side}
                group={groupRef.current!}
                surfaceZ={surfaceZ[side]}
                interactive={side === activeView}
              />
            ) : [];
          })
        )}
    </group>
  );
}
