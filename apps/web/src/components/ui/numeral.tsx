import { cn } from "@/lib/cn";

/**
 * Signature element: counts rendered as keepsakes — heavy sans-serif with
 * tabular numerals so values stay aligned when they change.
 */
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
      className={cn("font-sans font-extrabold tabular-nums", className)}
      style={{
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "-0.02em",
        color,
      }}
    >
      {children}
    </span>
  );
}
