/**
 * Canvas-based texture compositor.
 * Paints the t-shirt base color and user design onto a 2048x2048 canvas.
 * The canvas is used as a Three.js CanvasTexture — NO server calls, all client-side.
 */

import {
  DESIGN_PLACEMENT,
  TEXTURE_SIZE,
  UV_REGIONS,
} from "@/lib/constants";
import type { ActiveView } from "@/types/designer";

/**
 * Composites the t-shirt texture onto the given canvas.
 *
 * @param canvas    - The persistent 2048x2048 canvas element
 * @param baseColor - Hex color string for the t-shirt body
 * @param designURL - Object URL of the user's design image, or null
 * @param activeView - Which panel is currently shown ("front" | "back")
 * @returns A promise that resolves when painting is complete
 */
export async function composite(
  canvas: HTMLCanvasElement,
  baseColor: string,
  designURL: string | null,
  activeView: ActiveView
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear and fill with base color
  ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // Add subtle fabric texture hint (very light noise-like pattern)
  addFabricTexture(ctx, baseColor);

  // If no design, we're done
  if (!designURL) return;

  // Determine the target UV region for the current view
  const region = UV_REGIONS[activeView];
  const placement = DESIGN_PLACEMENT[activeView];

  // Load the design image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const { naturalWidth: imgW, naturalHeight: imgH } = img;

      // Calculate the max bounding box for the design within the panel
      const maxW = region.width * placement.maxWidthRatio;
      const maxH = region.height * placement.maxHeightRatio;

      // Scale design to fit within the bounding box, maintaining aspect ratio
      const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      // Center horizontally; position vertically according to offsetYRatio
      const centerX = region.x + region.width * placement.offsetXRatio;
      const topY =
        region.y + region.height * placement.offsetYRatio - drawH / 2;

      const drawX = centerX - drawW / 2;
      const drawY = topY;

      // Draw the design image
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      resolve();
    };

    img.onerror = () => {
      // Non-fatal: just skip drawing the design
      console.warn("textureCompositor: failed to load design image");
      resolve();
    };

    img.src = designURL;
  });
}

/**
 * Adds a very subtle fabric-like texture by drawing a faint grid overlay.
 * This gives the impression of fabric weave without heavy computation.
 */
function addFabricTexture(ctx: CanvasRenderingContext2D, baseColor: string): void {
  // Parse base color lightness to decide overlay color
  const isDark = isColorDark(baseColor);
  const overlayColor = isDark
    ? "rgba(255,255,255,0.03)"
    : "rgba(0,0,0,0.03)";

  ctx.strokeStyle = overlayColor;
  ctx.lineWidth = 1;

  const step = 8;
  ctx.beginPath();
  for (let x = 0; x <= TEXTURE_SIZE; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, TEXTURE_SIZE);
  }
  for (let y = 0; y <= TEXTURE_SIZE; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(TEXTURE_SIZE, y);
  }
  ctx.stroke();
}

/**
 * Returns true if the given hex color is considered dark (lightness < 50%).
 */
function isColorDark(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
