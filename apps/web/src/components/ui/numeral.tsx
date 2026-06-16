import { cn } from "@/lib/cn";

/**
 * Signature element: counts rendered as keepsakes — heavy sans-serif with
 * tabular numerals so values stay aligned when they change.
 *
 * Pass children as the key (via `animate`) when you want a fresh rise-in
 * animation on every count change.
 */
export function Numeral({
  children,
  size = 46,
  color,
  className,
  animate,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}) {
  return (
    <span
      key={animate ? String(children) : undefined}
      className={cn(
        "font-sans font-extrabold tabular-nums",
        animate && "rise-in inline-block",
        className,
      )}
      style={{
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "-0.02em",
        color,
        animationDuration: animate ? "0.32s" : undefined,
      }}
    >
      {children}
    </span>
  );
}
