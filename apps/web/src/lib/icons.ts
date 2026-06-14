import {
  Sun,
  Plane,
  Gift,
  Cake,
  Clock,
  GraduationCap,
  Home,
  Heart,
  Award,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
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

/** Milestone category → lucide icon. Lowercased, falls back to Star. */
export const milestoneIcon: Record<string, LucideIcon> = {
  school: GraduationCap,
  "coming of age": Award,
  birthday: Cake,
  home: Home,
  life: Sparkles,
  trip: Plane,
  love: Heart,
};

export const milestoneIconFor = (category: string): LucideIcon =>
  milestoneIcon[category.toLowerCase().trim()] ?? Star;
