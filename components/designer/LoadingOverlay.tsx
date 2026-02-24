"use client";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm rounded-xl z-10">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-brand-red animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-500 font-inter">Loading 3D model…</p>
    </div>
  );
}
