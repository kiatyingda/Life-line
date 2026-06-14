import { DAY_MS } from "../constants";

export function parseISO(iso: string): Date {
  return new Date(iso + "T00:00:00");
}

/** Local midnight today. */
export function today(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

export function yearOf(iso: string): number {
  return parseISO(iso).getFullYear();
}

export function ageOn(birthISO: string, on: Date = today()): number {
  const b = parseISO(birthISO);
  let age = on.getFullYear() - b.getFullYear();
  const m = on.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < b.getDate())) age -= 1;
  return age;
}

export function nextBirthday(birthISO: string, from: Date = today()): Date {
  const b = parseISO(birthISO);
  let n = new Date(from.getFullYear(), b.getMonth(), b.getDate());
  if (n < from) n = new Date(from.getFullYear() + 1, b.getMonth(), b.getDate());
  return n;
}

export function daysBetween(target: Date, from: Date = today()): number {
  return Math.round((target.getTime() - from.getTime()) / DAY_MS);
}
