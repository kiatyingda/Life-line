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
 * First-launch sample household (the spec's family).
 * Birth dates resolve to the listed ages around mid-2026.
 */
export const seedData: AppData = {
  people: [
    { id: "me", name: "Me", relationship: "self", birthDate: "1983-09-15", lifeExpectancy: 86, emoji: "🧑🏻", color: PERSON_COLORS.self },
    { id: "dad", name: "Dad", relationship: "parent", birthDate: "1952-11-03", lifeExpectancy: 85, emoji: "👨🏻‍🦳", color: PERSON_COLORS.parent },
    { id: "mum", name: "Mum", relationship: "parent", birthDate: "1956-07-21", lifeExpectancy: 87, emoji: "👩🏻‍🦳", color: PERSON_COLORS.parentAlt },
    { id: "alicia", name: "Alicia", relationship: "child", birthDate: "2013-12-20", lifeExpectancy: 90, emoji: "👧🏻", color: PERSON_COLORS.child },
    { id: "amelia", name: "Amelia", relationship: "child", birthDate: "2017-10-30", lifeExpectancy: 90, emoji: "🧒🏻", color: PERSON_COLORS.childAlt },
  ],
  memories: [
    { id: "m1", title: "Dim sum, the whole table", note: "Dad ordered too much. Again.", date: "2026-05-31", personIds: ["dad", "mum", "me"] },
    { id: "m2", title: "First snow in Hokkaido", note: "Amelia wouldn't come inside.", date: "2026-01-04", personIds: ["me", "alicia", "amelia"] },
    { id: "m3", title: "Alicia's art prize", date: "2026-03-18", personIds: ["alicia"] },
    { id: "m4", title: "Sunday roast, everyone home", date: "2026-06-08", personIds: ["me", "dad", "mum", "alicia", "amelia"] },
  ],
  milestones: [
    { id: "k1", title: "Amelia → secondary school", date: "2029-01-08", personId: "amelia", category: "school", emoji: "🏫" },
    { id: "k2", title: "Alicia turns 18", date: "2031-12-20", personId: "alicia", category: "coming of age", emoji: "🎓" },
    { id: "k3", title: "Dad turns 80", date: "2032-11-03", personId: "dad", category: "birthday", emoji: "🎂" },
    { id: "k4", title: "Mortgage paid off", date: "2035-06-01", category: "home", emoji: "🏡" },
    { id: "k5", title: "Retirement at 55", date: "2038-09-15", personId: "me", category: "life", emoji: "🌅" },
  ],
};
