import clsx from "clsx";

interface EyebrowProps {
  number?: string;
  onDark?: boolean;
  children: React.ReactNode;
}

export default function Eyebrow({ number, onDark = false, children }: EyebrowProps) {
  return (
    <p className={clsx("ks-label", onDark ? "text-ks-on-dark-muted" : "text-ks-muted")}>
      {number && `${number} - `}
      {children}
    </p>
  );
}
