"use client";

import { useCallback } from "react";
import { validateAndPrepareFile } from "@/lib/security";
import type { ValidationResult } from "@/types/designer";

export interface FileValidationReturn {
  validate: (file: File) => Promise<
    | { valid: true; objectURL: string }
    | { valid: false; error: string }
  >;
}

/**
 * Hook that provides a file validation function for design uploads.
 * Handles MIME type, magic bytes, file size, SVG sanitization, and dimensions.
 */
export function useFileValidation(): FileValidationReturn {
  const validate = useCallback(async (file: File) => {
    return validateAndPrepareFile(file);
  }, []);

  return { validate };
}
