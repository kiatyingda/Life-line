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
    <div className="inline-flex rounded-[11px] bg-canvas-deep p-[3px]">
      {options.map(([k, l]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "rounded-[9px] px-[14px] py-[7px] font-sans text-[12.5px] font-semibold transition",
            value === k ? "bg-card text-ink shadow-card" : "bg-transparent text-ink-3",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
