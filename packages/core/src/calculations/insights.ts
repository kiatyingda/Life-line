import type { Person } from "../types";
import { today, nextBirthday, daysBetween } from "./date";
import { sharedYears, yearsUntilAdult } from "./moments";

export type InsightKind = "child" | "trip" | "birthday";

export interface Insight {
  kind: InsightKind; // UI maps this to an icon — core stays icon-free
  text: string;
}

const first = (p: Person): string => p.name.split(" ")[0] ?? p.name;

export function insightsFor(people: Person[], now: Date = today()): Insight[] {
  const self = people.find((p) => p.relationship === "self");
  const out: Insight[] = [];

  for (const child of people.filter((p) => p.relationship === "child")) {
    const n = yearsUntilAdult(child, now);
    out.push({ kind: "child", text: `${first(child)} becomes an adult in ${n} years — about ${n} more summers at home.` });
  }

  for (const parent of people.filter((p) => p.relationship === "parent")) {
    const n = sharedYears(parent, self, now);
    out.push({ kind: "trip", text: `Around ${n} more yearly trips with ${first(parent)}, if you go once a year.` });
  }

  const soonest = people
    .map((p) => ({ p, days: daysBetween(nextBirthday(p.birthDate, now), now) }))
    .sort((a, b) => a.days - b.days)[0];
  if (soonest) {
    out.push({ kind: "birthday", text: `${first(soonest.p)}'s birthday is in ${soonest.days} days. A good reason to gather.` });
  }

  return out;
}
