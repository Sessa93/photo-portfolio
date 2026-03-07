import Link from "next/link";
import { ReactNode } from "react";

interface NavButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "a" | "button" | "link";
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function NavButton({
  href,
  children,
  className = "",
  onClick,
  as = "a",
  disabled = false,
  type,
}: NavButtonProps) {
  const base =
    "relative px-8 py-4 text-base font-semibold text-neutral-400 rounded transition-all duration-200 hover:text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50";
  const underline =
    "absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-neutral-400 to-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left";

  if (as === "link" && href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
        <span className={underline} />
      </Link>
    );
  }
  if (as === "button") {
    return (
      <button
        onClick={onClick}
        className={`${base} ${className}`}
        disabled={disabled}
        type={type}
      >
        {children}
        <span className={underline} />
      </button>
    );
  }
  // Default to anchor
  return (
    <a href={href} className={`${base} ${className}`}>
      {children}
      <span className={underline} />
    </a>
  );
}
