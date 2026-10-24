import type { Metadata } from "next";
import { Suspense } from "react";
import { DesignerShell } from "@/components/designer/DesignerShell";
import SiteHeader from "@/components/ks/SiteHeader";

export const metadata: Metadata = {
  title: "Designer | KS Web & Wear",
  description: "Customise your t-shirt with your own artwork. Upload a PNG, JPG or SVG and see it on a 3D model instantly.",
};

export default function DesignerPage() {
  return (
    <>
      <SiteHeader />
      <main className="ks-container py-6">
        <Suspense fallback={<div className="h-[47.5rem] w-full bg-ks-fog" />}>
          <DesignerShell />
        </Suspense>
      </main>
    </>
  );
}
