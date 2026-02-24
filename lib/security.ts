/**
 * Security utilities for file upload validation.
 * All validation is client-side only — no files are ever sent to a server.
 */

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_IMAGE_DIMENSION,
} from "@/lib/constants";
import type { ValidationResult } from "@/types/designer";

// Magic byte signatures for supported image formats
const MAGIC_BYTES: Record<string, number[]> = {
  png: [0x89, 0x50, 0x4e, 0x47], // PNG
  jpeg: [0xff, 0xd8, 0xff],        // JPEG/JPG
};

/**
 * Reads the first N bytes of a File as a Uint8Array.
 */
async function readMagicBytes(file: File, count: number): Promise<Uint8Array> {
  const slice = file.slice(0, count);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Checks if the file's magic bytes match a known format.
 * Returns the detected format or null.
 */
async function detectImageFormat(
  file: File
): Promise<"png" | "jpeg" | "svg" | null> {
  // SVG is text-based — check MIME type and content
  if (file.type === "image/svg+xml") {
    return "svg";
  }

  const bytes = await readMagicBytes(file, 4);

  if (
    bytes[0] === MAGIC_BYTES.png[0] &&
    bytes[1] === MAGIC_BYTES.png[1] &&
    bytes[2] === MAGIC_BYTES.png[2] &&
    bytes[3] === MAGIC_BYTES.png[3]
  ) {
    return "png";
  }

  if (
    bytes[0] === MAGIC_BYTES.jpeg[0] &&
    bytes[1] === MAGIC_BYTES.jpeg[1] &&
    bytes[2] === MAGIC_BYTES.jpeg[2]
  ) {
    return "jpeg";
  }

  return null;
}

/**
 * Sanitizes an SVG string by removing dangerous elements and attributes.
 * Returns a sanitized SVG string, or null if the SVG is malformed.
 */
export function sanitizeSVG(svgText: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  // Check for parser errors
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    return null;
  }

  // Remove dangerous elements
  const dangerousElements = ["script", "foreignObject", "use", "iframe"];
  dangerousElements.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  });

  // Remove all on* event attributes and dangerous attributes from every element
  const allElements = doc.querySelectorAll("*");
  allElements.forEach((el) => {
    const attrsToRemove: string[] = [];
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (
        attr.name.startsWith("on") ||       // event handlers
        attr.name === "href" && attr.value.startsWith("javascript:") ||
        attr.name === "xlink:href" && attr.value.startsWith("javascript:")
      ) {
        attrsToRemove.push(attr.name);
      }
    }
    attrsToRemove.forEach((attr) => el.removeAttribute(attr));
  });

  // Serialize back to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc.documentElement);
}

/**
 * Validates image dimensions after decoding.
 */
function validateImageDimensions(url: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        resolve({ valid: false, error: "Image appears to be empty or corrupted." });
      } else if (
        img.naturalWidth > MAX_IMAGE_DIMENSION ||
        img.naturalHeight > MAX_IMAGE_DIMENSION
      ) {
        resolve({
          valid: false,
          error: `Image is too large. Maximum dimensions are ${MAX_IMAGE_DIMENSION}×${MAX_IMAGE_DIMENSION}px.`,
        });
      } else {
        resolve({ valid: true });
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: "Could not decode image. File may be corrupted." });
    };
    img.src = url;
  });
}

/**
 * Sanitizes a filename for safe display in the UI.
 */
export function sanitizeFileName(name: string): string {
  // Strip path separators and limit length
  const stripped = name.replace(/[/\\:*?"<>|]/g, "").trim();
  return stripped.length > 50 ? `${stripped.slice(0, 47)}...` : stripped;
}

/**
 * Full validation pipeline for an uploaded design file.
 * Returns a validated object URL if valid, or an error message.
 */
export async function validateAndPrepareFile(
  file: File
): Promise<{ valid: true; objectURL: string } | { valid: false; error: string }> {
  // 1. Check file size
  if (file.size === 0) {
    return { valid: false, error: "File is empty." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const maxMB = MAX_FILE_SIZE_BYTES / 1_000_000;
    return { valid: false, error: `File is too large. Maximum size is ${maxMB}MB.` };
  }

  // 2. Check MIME type
  const mimeAllowed = ALLOWED_MIME_TYPES.some(
    (allowed) => file.type === allowed || file.type === "image/jpg"
  );
  if (!mimeAllowed) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload a PNG, JPG, or SVG image.",
    };
  }

  // 3. Magic byte / format detection
  const format = await detectImageFormat(file);
  if (!format && file.type !== "image/svg+xml") {
    return {
      valid: false,
      error: "File content does not match a supported image format.",
    };
  }

  // 4. SVG-specific: sanitize
  if (format === "svg") {
    const text = await file.text();
    const sanitized = sanitizeSVG(text);
    if (!sanitized) {
      return { valid: false, error: "SVG file appears to be malformed or invalid." };
    }
    // Create a sanitized blob
    const blob = new Blob([sanitized], { type: "image/svg+xml" });
    const objectURL = URL.createObjectURL(blob);
    const dimResult = await validateImageDimensions(objectURL);
    if (!dimResult.valid) {
      URL.revokeObjectURL(objectURL);
      return { valid: false, error: dimResult.error! };
    }
    return { valid: true, objectURL };
  }

  // 5. Raster: check dimensions
  const objectURL = URL.createObjectURL(file);
  const dimResult = await validateImageDimensions(objectURL);
  if (!dimResult.valid) {
    URL.revokeObjectURL(objectURL);
    return { valid: false, error: dimResult.error! };
  }

  return { valid: true, objectURL };
}
