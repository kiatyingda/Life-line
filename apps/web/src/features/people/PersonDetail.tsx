"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Pencil, Sun, Trash2 } from "lucide-react";
import { momentsFor, ageOn, parseISO, type Person } from "@lifelines/core";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Numeral } from "@/components/ui/numeral";
import { Avatar } from "@/components/ui/avatar";
import { momentIcon, milestoneIconFor } from "@/lib/icons";

export function PersonDetail({
  person,
  onBack,
  onEdit,
}: {
  person: Person;
  onBack: () => void;
  onEdit: () => void;
}) {
  const self = useAppStore(selectSelf);
  const memories = useAppStore((s) => s.memories);
  const milestones = useAppStore((s) => s.milestones);
  const removePerson = useAppStore((s) => s.removePerson);

  // Two-tap remove: first tap arms the action, second tap confirms.
  // Auto-disarms after 3s so a stray tap doesn't leave it primed.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  const onRemove = () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    removePerson(person.id);
    onBack();
  };

  const moments = momentsFor(person, self);
  const mems = memories.filter((m) => m.personIds.includes(person.id));
  const stones = milestones
    .filter((m) => m.personId === person.id)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const heading =
    person.relationship === "child"
      ? "Before they're grown"
      : person.relationship === "self"
        ? "Your story"
        : "Time you have together";

  return (
    <div className="screen-in pb-6">
      {/* header band in person color */}
      <div
        className="-mt-[14px] px-6 pb-8 pt-6"
        style={{
          background: `linear-gradient(165deg, ${person.color}3A 0%, ${person.color}18 55%, ${person.color}08 100%)`,
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="press grid h-10 w-10 place-items-center rounded-pill bg-card shadow-card"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="text-ink" strokeWidth={2.4} />
          </button>
          <button
            onClick={onEdit}
            className="press grid h-10 w-10 place-items-center rounded-pill bg-card shadow-card"
            aria-label="Edit"
          >
            <Pencil size={16} className="text-ink-2" strokeWidth={2.4} />
          </button>
        </div>
        <Avatar p={person} size={72} />
        <div
          className="mt-4 font-sans text-[34px] font-extrabold leading-[1.02] text-ink"
          style={{ letterSpacing: "-0.025em" }}
        >
          {person.name}
        </div>
        <div className="mt-1 font-sans text-[13.5px] font-medium text-ink-2">
          <span className="capitalize">{person.relationship}</span>
          {" · "}
          {ageOn(person.birthDate)} years old
        </div>
      </div>

      <div className="px-5 pt-6">
        <SectionLabel>{heading}</SectionLabel>
        <div
          className={`mb-7 grid gap-3 ${moments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {moments.map((m) => {
            const Icon = momentIcon[m.key] ?? Sun;
            return (
              <div key={m.key} className="rounded-card bg-card p-5 shadow-card">
                <Icon size={16} style={{ color: person.color }} strokeWidth={2.4} />
                <div className="mt-3">
                  <Numeral size={40} color="var(--ink)">
                    {m.n}
                  </Numeral>
                </div>
                <div className="mt-1 font-sans text-[14px] font-bold text-ink">
                  {m.unit}
                </div>
                <div className="mt-[2px] font-sans text-[12.5px] font-medium text-ink-3">
                  {m.sub}
                </div>
              </div>
            );
          })}
        </div>

        {stones.length > 0 ? (
          <>
            <SectionLabel>Milestones ahead</SectionLabel>
            <div className="mb-7 flex flex-col gap-2">
              {stones.map((m) => {
                const Icon = milestoneIconFor(m.category);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-[16px] bg-card-soft px-4 py-3 shadow-[inset_0_0_0_1px_var(--line)]"
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-pill"
                      style={{ background: `${person.color}1A` }}
                    >
                      <Icon size={15} style={{ color: person.color }} strokeWidth={2.4} />
                    </span>
                    <span className="flex-1 font-sans text-[14px] font-semibold text-ink">
                      {m.title}
                    </span>
                    <span className="font-sans text-[12.5px] font-medium text-ink-3">
                      {parseISO(m.date).getFullYear()}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        <SectionLabel>
          {mems.length} {mems.length === 1 ? "moment" : "moments"} together
        </SectionLabel>
        {mems.length === 0 ? (
          <div className="py-2 font-sans text-[13.5px] font-medium text-ink-3">
            None yet. The small ones matter most.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {mems.map((m) => (
              <div key={m.id} className="rounded-[16px] bg-card px-4 py-3 shadow-card">
                <div className="flex justify-between gap-3">
                  <span className="font-sans text-[14.5px] font-bold text-ink">
                    {m.title}
                  </span>
                  <span className="whitespace-nowrap font-sans text-[12px] font-medium text-ink-3">
                    {parseISO(m.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {m.note ? (
                  <div className="mt-1 font-sans text-[13px] text-ink-2">{m.note}</div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {person.relationship !== "self" ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="press inline-flex items-center gap-2 rounded-pill px-5 py-[10px] font-sans text-[13px] font-bold transition"
              style={
                armed
                  ? { background: "var(--brand)", color: "#FFF7F2" }
                  : { color: "var(--ink-3)" }
              }
            >
              <Trash2 size={14} strokeWidth={2.4} />
              {armed ? `Tap again to remove ${person.name.split(" ")[0]}` : `Remove ${person.name.split(" ")[0]}`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-sans text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
      {children}
    </div>
  );
}
