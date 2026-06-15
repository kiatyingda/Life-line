"use client";

import { useMemo } from "react";
import {
  windowDays,
  windowMonths,
  windowYears,
  type Person,
} from "@lifelines/core";

export type GridUnit = "day" | "month" | "year";

const COLS: Record<GridUnit, number> = { day: 30, month: 12, year: 10 };
const DOT_PX: Record<GridUnit, number> = { day: 8, month: 18, year: 26 };
const GAP_PX: Record<GridUnit, number> = { day: 3, month: 5, year: 7 };

/**
 * Dense per-person grid of remaining shared-time units. Each dot is a
 * single month / day / year still ahead of you with this person. Not a life
 * span — never extends past the window end.
 *
 * No "elapsed" half, no end marker. The grid starts at *now* and stops at
 * the boundary of togetherness.
 */
export function MomentsGrid({
  person,
  self,
  unit,
}: {
  person: Person;
  self: Person | undefined;
  unit: GridUnit;
}) {
  const count = useMemo(() => {
    if (unit === "day") return windowDays(person, self);
    if (unit === "month") return windowMonths(person, self);
    return windowYears(person, self);
  }, [person, self, unit]);

  const cols = COLS[unit];
  const dot = DOT_PX[unit];
  const gap = GAP_PX[unit];

  if (count === 0) {
    return (
      <p className="font-sans text-[12.5px] text-ink-3">
        The window closes here. Make a moment.
      </p>
    );
  }

  // Cap stagger so it never feels like a load delay; later dots all enter
  // together once the cap is hit.
  const staggerMs = (i: number) => Math.min(i * 6, 220);

  return (
    <div
      role="img"
      aria-label={`${count} ${unit}${count === 1 ? "" : "s"} left with ${person.name}`}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${dot}px)`,
        gap: `${gap}px`,
        justifyContent: "start",
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const isNow = i === 0;
        return (
          <span
            key={i}
            aria-hidden
            className="dot-in"
            style={{
              width: dot,
              height: dot,
              borderRadius: "50%",
              background: person.color,
              // gentle fade into the future — the far edge sits quieter
              opacity: isNow ? 1 : 0.92 - (i / Math.max(count, 1)) * 0.34,
              animationDelay: `${staggerMs(i)}ms`,
              // tiny halo on "now" so it reads as the anchor point
              boxShadow: isNow
                ? `0 0 0 2px var(--card), 0 0 0 3px ${person.color}66`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
