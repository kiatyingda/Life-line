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
        "flex items-center gap-[7px] rounded-pill px-3 py-[7px] font-sans text-[13px] font-semibold capitalize transition",
        active ? "text-ink" : "text-ink-2",
      )}
    >
      {children}
    </button>
  );
}
