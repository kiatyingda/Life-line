import { cn } from "@/lib/cn";

export function Chip({
  active,
  color,
  children,
  onClick,
}: {
  active: boolean;
  color: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? `${color}20` : "var(--card)",
        boxShadow: `inset 0 0 0 1.5px ${active ? `${color}70` : "var(--line-2)"}`,
      }}
      className={cn(
        "press flex items-center gap-2 rounded-pill py-1 pl-1 pr-[14px] font-sans text-[13px] font-bold capitalize transition",
        active ? "text-ink" : "text-ink-2/85",
      )}
    >
      {children}
    </button>
  );
}
