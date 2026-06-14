"use client";

import { useMemo, useState } from "react";
import {
  windowDays,
  windowMonths,
  windowYears,
  type Person,
} from "@lifelines/core";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { Numeral } from "@/components/ui/numeral";
import { Segmented } from "@/components/ui/segmented";
import { Sunrise } from "@/components/ui/sunrise";
import { MomentsGrid, type GridUnit } from "./MomentsGrid";

function Greeting() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div>
      <div className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-2/80">
        {date}
      </div>
      <div className="mt-1 font-serif text-[34px] font-medium leading-[1.05] text-ink">
        Good {part}.
      </div>
    </div>
  );
}

function unitSuffix(p: Person, unit: GridUnit, n: number): string {
  if (p.relationship === "child") {
    const first = p.name.split(" ")[0];
    if (unit === "year") return `${n === 1 ? "summer" : "summers"} before ${first} is grown`;
    if (unit === "month") return `${n === 1 ? "month" : "months"} before grown`;
    return `days before grown`;
  }
  if (unit === "year") return `${n === 1 ? "summer" : "summers"} left together`;
  if (unit === "month") return `${n === 1 ? "month" : "months"} still ahead`;
  return `days still ahead`;
}

function PersonBlock({
  person,
  self,
  unit,
}: {
  person: Person;
  self: Person | undefined;
  unit: GridUnit;
}) {
  const count =
    unit === "day"
      ? windowDays(person, self)
      : unit === "month"
        ? windowMonths(person, self)
        : windowYears(person, self);

  return (
    <div className="rounded-card bg-card p-[18px] shadow-card">
      <header className="mb-4 flex items-center gap-3">
        <Avatar p={person} size={44} />
        <div className="flex-1">
          <div className="font-sans text-[15.5px] font-semibold text-ink">
            {person.name}
          </div>
          <div className="flex items-baseline gap-[6px]">
            <Numeral size={22} color={person.color}>
              {count.toLocaleString()}
            </Numeral>
            <span className="font-sans text-[12.5px] text-ink-3">
              {unitSuffix(person, unit, count)}
            </span>
          </div>
        </div>
      </header>
      <MomentsGrid person={person} self={self} unit={unit} />
    </div>
  );
}

export function HomeScreen(_: { onPerson: (id: string) => void }) {
  const people = useAppStore((s) => s.people);
  const self = useAppStore(selectSelf);
  const [unit, setUnit] = useState<GridUnit>("month");

  const others = useMemo(
    () => people.filter((p) => p.relationship !== "self"),
    [people],
  );

  // Track which chips the user has hidden. Default: nobody hidden (all shown).
  // Stale IDs (someone removed) are tolerated — filter ignores unknown ids.
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const isActive = (id: string) => !hidden.has(id);
  const shown = others.filter((p) => isActive(p.id));

  return (
    <div>
      {/* sunset header — Headspace-influenced warm gradient */}
      <div className="bg-sunset -mt-[14px] px-5 pb-[22px] pt-5">
        <Greeting />

        {others.length > 0 ? (
          <>
            <div className="mt-5 flex flex-wrap gap-2">
              {others.map((p) => (
                <Chip
                  key={p.id}
                  active={isActive(p.id)}
                  color={p.color}
                  onClick={() => toggle(p.id)}
                >
                  <Avatar p={p} size={22} />
                  <span>{p.name}</span>
                </Chip>
              ))}
            </div>

            <div className="mt-4">
              <Segmented<GridUnit>
                value={unit}
                onChange={setUnit}
                options={[
                  ["day", "Days"],
                  ["month", "Months"],
                  ["year", "Years"],
                ]}
              />
            </div>
          </>
        ) : null}
      </div>

      {/* grid zone */}
      <div className="px-5 pt-5">
        {others.length === 0 ? (
          <div className="rounded-card bg-card p-6 text-center shadow-card">
            <div className="mb-3 flex justify-center">
              <Sunrise size={80} tone="soft" />
            </div>
            <p className="font-serif text-[19px] font-medium leading-snug text-ink">
              Add someone to see your shared months.
            </p>
            <p className="mt-2 font-sans text-[13px] text-ink-3">
              Tap <span className="font-semibold text-ink-2">+</span> below to begin.
            </p>
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-card bg-card-soft p-5 text-center">
            <Label>Pick at least one person to show their grid.</Label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map((p) => (
              <PersonBlock key={p.id} person={p} self={self} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
