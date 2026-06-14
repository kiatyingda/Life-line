import { Sun, Plane, Gift, Cake, Clock, GraduationCap, type LucideIcon } from "lucide-react";
import type { InsightKind } from "@lifelines/core";

/** Maps domain keys to icons — keeps @lifelines/core icon-free and portable. */
export const momentIcon: Record<string, LucideIcon> = {
  summers: Sun,
  summer: Sun,
  trips: Plane,
  trip: Plane,
  birthdays: Cake,
  birthday: Cake,
  seasons: Gift,
  lived: Clock,
};

export const insightIcon: Record<InsightKind, LucideIcon> = {
  child: GraduationCap,
  trip: Plane,
  birthday: Cake,
};
