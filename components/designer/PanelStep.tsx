interface PanelStepProps {
  number: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}

export function PanelStep({ number, title, aside, children }: PanelStepProps) {
  return (
    <section className="flex flex-col gap-3 border-b border-ks-line px-6 py-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="ks-label text-ks-muted">
          <span className="text-ks-accent">{number}</span> {title}
        </h2>
        {aside && <span className="text-sm font-semibold">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
