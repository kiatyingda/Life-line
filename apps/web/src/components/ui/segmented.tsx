"use client";
import { cn } from "@/lib/cn";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<readonly [T, string]>;
}) {
  return (
    <div className="inline-flex rounded-pill bg-canvas-deep p-1">
      {options.map(([k, l]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "rounded-pill px-4 py-[8px] font-sans text-[12.5px] font-bold transition",
            value === k
              ? "bg-card text-ink shadow-card"
              : "bg-transparent text-ink-3 hover:text-ink-2",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
