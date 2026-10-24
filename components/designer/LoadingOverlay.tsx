"use client";

export function LoadingOverlay() {
  return (
    <div role="status" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ks-fog">
      <div className="h-1 w-24 animate-pulse bg-ks-ink" />
      <p className="ks-label text-ks-muted">Loading 3D model…</p>
    </div>
  );
}
