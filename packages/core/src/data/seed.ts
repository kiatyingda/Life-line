import type { AppData } from "../types";

/** Per-relationship identity colors (warm, distinct, no red). */
export const PERSON_COLORS = {
  self: "#5E7A6E",
  partner: "#B5654A",
  parent: "#6E7E96",
  parentAlt: "#A6738E",
  child: "#C99A4B",
  childAlt: "#7E9367",
  sibling: "#8E7BA6",
  friend: "#6E8E84",
} as const;

/**
 * Initial app state. New users start empty and are onboarded into setting up
 * "Me" first — the rest of their household is theirs to add.
 */
export const seedData: AppData = {
  people: [],
  memories: [],
  milestones: [],
};
