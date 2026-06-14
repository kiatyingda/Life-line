import type { Person } from "../types";
import { ADULT_AGE, DAY_MS } from "../constants";
import { parseISO, today } from "./date";

/**
 * The shared window's end date — the moment the time "with this person" runs
 * out. For children that's their 18th birthday; for adults it's the earlier of
 * their or your life-expectancy date. Never frame this as a death dot — it's
 * the boundary of *togetherness*, not life.
 */
export function windowEnd(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): Date {
  const b = parseISO(p.birthDate);

  // Self looks at their own remaining lifeline — framed as time still yours,
  // never as a countdown to anything.
  if (p.relationship === "self") {
    return new Date(b.getFullYear() + p.lifeExpectancy, b.getMonth(), b.getDate());
  }

  if (p.relationship === "child") {
    return new Date(b.getFullYear() + ADULT_AGE, b.getMonth(), b.getDate());
  }

  const personHorizon = new Date(
    b.getFullYear() + p.lifeExpectancy,
    b.getMonth(),
    b.getDate(),
  );
  if (!self) return personHorizon;

  const sb = parseISO(self.birthDate);
  const selfHorizon = new Date(
    sb.getFullYear() + self.lifeExpectancy,
    sb.getMonth(),
    sb.getDate(),
  );
  return personHorizon < selfHorizon ? personHorizon : selfHorizon;
}

/** Whole days from now to the window end. Clamped to zero. */
export function windowDays(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): number {
  const end = windowEnd(p, self, now);
  return Math.max(0, Math.round((end.getTime() - now.getTime()) / DAY_MS));
}

/** Whole calendar months from now to the window end. Clamped to zero. */
export function windowMonths(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): number {
  const end = windowEnd(p, self, now);
  if (end <= now) return 0;
  let m = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  if (end.getDate() < now.getDate()) m -= 1;
  return Math.max(0, m);
}

/** Whole calendar years from now to the window end. Clamped to zero. */
export function windowYears(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): number {
  const end = windowEnd(p, self, now);
  if (end <= now) return 0;
  let y = end.getFullYear() - now.getFullYear();
  if (
    end.getMonth() < now.getMonth() ||
    (end.getMonth() === now.getMonth() && end.getDate() < now.getDate())
  ) {
    y -= 1;
  }
  return Math.max(0, y);
}
