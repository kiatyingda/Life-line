"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  seedData,
  type Memory,
  type Milestone,
  type Person,
} from "@lifelines/core";

const uid = (): string => Math.random().toString(36).slice(2, 9);

interface AppState {
  people: Person[];
  milestones: Milestone[];
  memories: Memory[];
  addPerson: (p: Omit<Person, "id">) => void;
  updatePerson: (p: Person) => void;
  removePerson: (id: string) => void;
  addMemory: (m: Omit<Memory, "id">) => void;
  addMilestone: (m: Omit<Milestone, "id">) => void;
  reset: () => void;
}

/**
 * Web binding of the persistence seam. Native swaps this single factory for
 * createJSONStorage(() => AsyncStorage) — store, selectors, and UI are unchanged.
 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
const webStorage = (): StateStorage =>
  typeof window !== "undefined" ? window.localStorage : noopStorage;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      people: seedData.people,
      milestones: seedData.milestones,
      memories: seedData.memories,
      addPerson: (p) => set((s) => ({ people: [...s.people, { ...p, id: uid() }] })),
      updatePerson: (p) =>
        set((s) => ({ people: s.people.map((x) => (x.id === p.id ? p : x)) })),
      // Removing a person cascades:
      //  - drops the person from `people`
      //  - removes their id from each memory's personIds; memories that end up
      //    with no people left are dropped (they were *about* this person)
      //  - unsets personId on any milestone whose owner was them (the
      //    milestone becomes a shared/family milestone instead of dropped)
      removePerson: (id) =>
        set((s) => {
          const memories = s.memories
            .map((m) => ({ ...m, personIds: m.personIds.filter((pid) => pid !== id) }))
            .filter((m) => m.personIds.length > 0);
          const milestones = s.milestones.map((m) =>
            m.personId === id ? { ...m, personId: undefined } : m,
          );
          return {
            people: s.people.filter((p) => p.id !== id),
            memories,
            milestones,
          };
        }),
      addMemory: (m) => set((s) => ({ memories: [{ ...m, id: uid() }, ...s.memories] })),
      addMilestone: (m) =>
        set((s) => ({ milestones: [...s.milestones, { ...m, id: uid() }] })),
      reset: () =>
        set({
          people: seedData.people,
          milestones: seedData.milestones,
          memories: seedData.memories,
        }),
    }),
    {
      // v2 wipes the old demo seed (Dad/Mum/Alicia/Amelia + sample memories).
      // Users now onboard into their own self profile on first launch.
      name: "lifelines:data:v2",
      storage: createJSONStorage(webStorage),
      partialize: (s) => ({
        people: s.people,
        milestones: s.milestones,
        memories: s.memories,
      }),
    },
  ),
);

/** Prevents SSR/persist hydration mismatch — gate first paint on this. */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(useAppStore.persist.hasHydrated());
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}

export const selectSelf = (s: AppState): Person | undefined =>
  s.people.find((p) => p.relationship === "self");
