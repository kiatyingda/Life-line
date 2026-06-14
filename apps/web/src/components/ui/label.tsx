import { cn } from "@/lib/cn";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
