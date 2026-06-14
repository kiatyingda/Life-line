import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const interactive = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "rounded-card bg-card p-[18px] shadow-card",
        interactive && "cursor-pointer transition-transform active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </div>
  );
}
