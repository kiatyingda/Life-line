import { cn } from "@/lib/cn";

/** Signature element: counts rendered as keepsakes, not metrics. */
export function Numeral({
  children,
  size = 46,
  color,
  className,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("font-serif font-medium", className)}
      style={{ fontSize: size, lineHeight: 0.95, color, fontFeatureSettings: "'ss01'" }}
    >
      {children}
    </span>
  );
}
