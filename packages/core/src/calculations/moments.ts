import type { Moment, Person } from "../types";
import { ADULT_AGE } from "../constants";
import { ageOn, today } from "./date";

const first = (p: Person): string => p.name.split(" ")[0] ?? p.name;

/** Remaining-years estimate. Deliberately rough — intention over actuarial precision. */
export function yearsLeft(p: Person, now: Date = today()): number {
  return Math.max(0, p.lifeExpectancy - ageOn(p.birthDate, now));
}

export function yearsUntilAdult(p: Person, now: Date = today()): number {
  return Math.max(0, ADULT_AGE - ageOn(p.birthDate, now));
}

/**
 * The shared window: you can only share time for as long as the shorter life lasts.
 * This is the honest, non-morbid core of the product.
 */
export function sharedYears(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): number {
  if (!self) return yearsLeft(p, now);
  return Math.min(yearsLeft(self, now), yearsLeft(p, now));
}

/** Curated to resonant, low-frequency units. Never weekends/days. */
export function momentsFor(
  p: Person,
  self: Person | undefined,
  now: Date = today(),
): Moment[] {
  if (p.relationship === "self") {
    return [
      { key: "lived", n: ageOn(p.birthDate, now), unit: "years lived", sub: "right in the middle of it" },
    ];
  }

  if (p.relationship === "child") {
    const n = yearsUntilAdult(p, now);
    return [
      { key: "summers", n, unit: n === 1 ? "summer" : "summers", sub: `before ${first(p)} is all grown` },
      { key: "seasons", n, unit: "holiday seasons", sub: "still at home" },
      { key: "birthdays", n, unit: n === 1 ? "birthday" : "birthdays", sub: "before adulthood" },
    ];
  }

  const n = sharedYears(p, self, now);
  return [
    { key: "summers", n, unit: n === 1 ? "summer" : "summers", sub: "left together" },
    { key: "trips", n, unit: n === 1 ? "trip" : "trips", sub: "if you travel once a year" },
    { key: "birthdays", n, unit: "birthdays", sub: "still to celebrate together" },
  ];
}
