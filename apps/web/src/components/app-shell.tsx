"use client";

import { useState } from "react";
import type { Person } from "@lifelines/core";
import { useAppStore, useHasHydrated } from "@/store/useAppStore";
import { TabBar, type Tab } from "./tab-bar";
import { HomeScreen } from "@/features/home/HomeScreen";
import { PeopleScreen } from "@/features/people/PeopleScreen";
import { PersonDetail } from "@/features/people/PersonDetail";
import { JournalScreen } from "@/features/journal/JournalScreen";
import { MemorySheet } from "@/features/journal/MemorySheet";
import { PersonSheet } from "@/features/people/PersonSheet";
import { OnboardingScreen } from "@/features/onboarding/OnboardingScreen";

function Splash() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span className="font-serif text-[22px] font-medium tracking-tight text-ink-3">
        LifeLines
      </span>
    </div>
  );
}

export function AppShell() {
  const hydrated = useHasHydrated();
  const people = useAppStore((s) => s.people);
  const addMemory = useAppStore((s) => s.addMemory);
  const addPerson = useAppStore((s) => s.addPerson);
  const updatePerson = useAppStore((s) => s.updatePerson);

  const [tab, setTab] = useState<Tab>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memOpen, setMemOpen] = useState(false);
  const [personSheet, setPersonSheet] = useState<{ open: boolean; editing: Person | null }>({
    open: false,
    editing: null,
  });

  const selected = selectedId ? (people.find((p) => p.id === selectedId) ?? null) : null;
  // What `+` adds depends on context: on People, always a person; on Home
  // with no one else added yet, a person (otherwise no moments to make);
  // everywhere else, a moment.
  const hasOthers = people.some((p) => p.relationship !== "self");
  const onAdd = () => {
    if (tab === "people" || (tab === "home" && !hasOthers)) {
      setPersonSheet({ open: true, editing: null });
    } else {
      setMemOpen(true);
    }
  };

  const needsOnboarding = hydrated && !people.some((p) => p.relationship === "self");

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-canvas-deep">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-canvas sm:h-[860px] sm:max-h-[92vh] sm:w-[420px] sm:rounded-[32px] sm:shadow-[0_30px_90px_rgba(42,38,32,0.22)]">
        {!hydrated ? (
          <Splash />
        ) : needsOnboarding ? (
          <OnboardingScreen onSave={addPerson} />
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain pt-[14px]">
              {selected ? (
                <PersonDetail
                  person={selected}
                  onBack={() => setSelectedId(null)}
                  onEdit={() => setPersonSheet({ open: true, editing: selected })}
                />
              ) : tab === "home" ? (
                <HomeScreen onPerson={setSelectedId} />
              ) : tab === "people" ? (
                <PeopleScreen onPerson={setSelectedId} />
              ) : (
                <JournalScreen onAdd={() => setMemOpen(true)} />
              )}
              <div className="h-[90px]" />
            </div>

            {!selected ? <TabBar tab={tab} onTab={setTab} onAdd={onAdd} /> : null}

            <MemorySheet
              open={memOpen}
              onOpenChange={setMemOpen}
              people={people}
              onSave={addMemory}
            />
            <PersonSheet
              open={personSheet.open}
              onOpenChange={(o) => setPersonSheet((s) => ({ ...s, open: o }))}
              editing={personSheet.editing}
              onSave={(p) => ("id" in p ? updatePerson(p) : addPerson(p))}
            />
          </>
        )}
      </div>
    </div>
  );
}
