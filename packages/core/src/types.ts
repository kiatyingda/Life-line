// Domain models. Platform-agnostic — shared by web and (future) native.

export type Relationship =
  | "self"
  | "partner"
  | "parent"
  | "child"
  | "sibling"
  | "friend";

export interface Person {
  id: string;
  name: string;
  relationship: Relationship;
  birthDate: string; // ISO yyyy-mm-dd
  lifeExpectancy: number; // rough, editable estimate — only shapes framing
  emoji: string;
  color: string; // hex, used as identity cue
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  personId?: string; // undefined = shared / family milestone
  category: string;
  emoji: string;
}

export interface Memory {
  id: string;
  title: string;
  note?: string;
  date: string; // ISO yyyy-mm-dd
  personIds: string[];
}

export interface Household {
  id: string;
  name: string;
  memberIds: string[];
}

export interface AppData {
  people: Person[];
  milestones: Milestone[];
  memories: Memory[];
}

/** A unit of remaining shared time, ready to render. */
export interface Moment {
  key: string;
  n: number;
  unit: string;
  sub: string;
}
