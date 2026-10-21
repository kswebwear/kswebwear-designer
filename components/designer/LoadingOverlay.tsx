"use client";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#14141f]/90 backdrop-blur-sm z-10">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-white/15 border-t-brand-red animate-spin" />
      </div>
      <p className="mt-4 text-sm text-white/60 font-inter">Loading 3D model…</p>
    </div>
  );
}
