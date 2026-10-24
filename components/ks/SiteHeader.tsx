import LogoMark from "./LogoMark";
import { SITE_URL } from "@/lib/constants";

const linkClass = "inline-flex min-h-ks-tap items-center text-[15px] font-medium text-ks-ink no-underline hover:text-ks-muted";

export default function SiteHeader() {
  return (
    <header className="border-b border-ks-line bg-ks-paper">
      <div className="ks-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3.5">
        <div className="flex items-center gap-4">
          <a href={SITE_URL} aria-label="KS Web & Wear home" className="flex items-center gap-3 text-ks-ink no-underline">
            <LogoMark />
            <span className="ks-title text-lg">KS Web &amp; Wear</span>
          </a>
          <span className="ks-label hidden border-l border-ks-line pl-4 text-ks-muted sm:inline">Shirt designer</span>
        </div>
        <nav aria-label="Designer" className="flex flex-wrap items-center gap-x-6">
          <a href={`${SITE_URL}/#pricing`} className={linkClass}>Pricing</a>
          <a href={`${SITE_URL}/#faq`} className={linkClass}>Help</a>
          <a href={SITE_URL} className={`${linkClass} !font-bold`}>← Back to site</a>
        </nav>
      </div>
    </header>
  );
}
