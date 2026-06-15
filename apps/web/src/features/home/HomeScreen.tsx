"use client";

import { useMemo, useState } from "react";
import {
  windowDays,
  windowMonths,
  windowYears,
  type Person,
} from "@lifelines/core";
import { ChevronRight } from "lucide-react";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import { Numeral } from "@/components/ui/numeral";
import { Segmented } from "@/components/ui/segmented";
import { MomentsGrid, type GridUnit } from "./MomentsGrid";

function Greeting({ name }: { name: string }) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const first = name.split(" ")[0] ?? name;
  // "Me" is the default — don't address the user as "Me" until they
  // give a real name (which they can do via the Self avatar → edit).
  const personable = first && first.toLowerCase() !== "me" && first.toLowerCase() !== "you";
  return (
    <div>
      <div className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-2/80">
        {date}
      </div>
      <h1
        className="mt-2 font-sans text-[36px] font-extrabold leading-[1.05] text-ink"
        style={{ letterSpacing: "-0.025em" }}
      >
        {personable ? (
          <>
            Good {part},<br />
            {first}.
          </>
        ) : (
          <>Good {part}.</>
        )}
      </h1>
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
  if (p.relationship === "self") {
    if (unit === "year") return `${n === 1 ? "summer" : "summers"} still yours`;
    if (unit === "month") return `${n === 1 ? "month" : "months"} still yours`;
    return `days still yours`;
  }
  if (unit === "year") return `${n === 1 ? "summer" : "summers"} left together`;
  if (unit === "month") return `${n === 1 ? "month" : "months"} still ahead`;
  return `days still ahead`;
}

function PersonBlock({
  person,
  self,
  unit,
  onTap,
}: {
  person: Person;
  self: Person | undefined;
  unit: GridUnit;
  onTap: () => void;
}) {
  const count =
    unit === "day"
      ? windowDays(person, self)
      : unit === "month"
        ? windowMonths(person, self)
        : windowYears(person, self);

  return (
    <div className="rounded-card bg-card p-6 shadow-card">
      <button
        onClick={onTap}
        className="press mb-5 flex w-full items-center gap-3 text-left"
        aria-label={`Open ${person.name}`}
      >
        <Avatar p={person} size={48} />
        <div className="flex-1">
          <div className="font-sans text-[17px] font-bold text-ink">{person.name}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <Numeral size={26} color={person.color}>
              {count.toLocaleString()}
            </Numeral>
            <span className="font-sans text-[12.5px] font-medium text-ink-3">
              {unitSuffix(person, unit, count)}
            </span>
          </div>
        </div>
        <ChevronRight size={18} className="text-ink-4" strokeWidth={2.4} />
      </button>
      <MomentsGrid person={person} self={self} unit={unit} />
    </div>
  );
}

export function HomeScreen({ onPerson }: { onPerson: (id: string) => void }) {
  const people = useAppStore((s) => s.people);
  const self = useAppStore(selectSelf);
  const [unit, setUnit] = useState<GridUnit>("month");

  // Everyone — self included. Self goes first so the user sees their own
  // lifeline at the top.
  const all = useMemo(
    () => [...people].sort((a, b) => (a.relationship === "self" ? -1 : b.relationship === "self" ? 1 : 0)),
    [people],
  );

  // Track which chips the user has hidden. Default: nobody hidden (all shown).
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const isActive = (id: string) => !hidden.has(id);
  const shown = all.filter((p) => isActive(p.id));
  const hasOthers = all.some((p) => p.relationship !== "self");

  return (
    <div className="screen-in">
      {/* sunset header */}
      <div className="bg-sunset -mt-[14px] px-6 pb-8 pt-8">
        <Greeting name={self?.name ?? "you"} />

        <div className="mt-7 flex flex-wrap gap-2">
          {all.map((p) => (
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

        <div className="mt-5">
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
      </div>

      {/* grid zone */}
      <div className="px-5 pt-6">
        {shown.length === 0 ? (
          <div className="rounded-card bg-card-soft p-6 text-center">
            <p className="font-sans text-[13.5px] font-medium text-ink-3">
              Pick at least one person above to show their grid.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {shown.map((p) => (
                <PersonBlock
                  key={p.id}
                  person={p}
                  self={self}
                  unit={unit}
                  onTap={() => onPerson(p.id)}
                />
              ))}
            </div>
            {!hasOthers ? (
              <div className="mt-5 rounded-card bg-card/70 p-5 text-center">
                <p className="font-sans text-[13.5px] font-medium text-ink-2">
                  Add the people who matter.
                </p>
                <p className="mt-1 font-sans text-[12.5px] text-ink-3">
                  Tap <span className="font-bold text-ink-2">+</span> below.
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
