import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "link" | "ink";
type Size = "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const base = "inline-flex items-center justify-center gap-3 font-bold no-underline rounded-ks transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-ks-accent text-ks-paper hover:bg-ks-ink",
  secondary: "border-[1.5px] border-ks-ink text-ks-ink hover:bg-ks-ink hover:text-ks-paper",
  // Used on accent backgrounds (CtaBand) where primary would disappear.
  ink: "bg-ks-ink text-ks-paper hover:bg-ks-paper hover:text-ks-ink",
  link: "text-ks-accent hover:text-ks-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-ks-tap px-5 text-base",
  lg: "min-h-ks-btn px-7 text-ks-body",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  icon,
  className,
  children,
}: ButtonProps) {
  const classes = clsx(base, variants[variant], variant === "link" ? "min-h-ks-tap" : sizes[size], className);
  const content = (
    <>
      {icon}
      {children}
      {variant === "link" && <ArrowRight size={16} aria-hidden="true" />}
    </>
  );

  if (!href) {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}
