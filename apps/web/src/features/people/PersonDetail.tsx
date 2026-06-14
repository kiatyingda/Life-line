"use client";

import { ChevronLeft, Pencil } from "lucide-react";
import { momentsFor, ageOn, parseISO, type Person } from "@lifelines/core";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Label } from "@/components/ui/label";
import { Numeral } from "@/components/ui/numeral";
import { Avatar } from "@/components/ui/avatar";
import { momentIcon } from "@/lib/icons";
import { Sun } from "lucide-react";

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
    <div className="pb-4">
      {/* header band in person color */}
      <div
        className="px-5 pb-6 pt-2"
        style={{
          background: `linear-gradient(160deg, ${person.color}26, ${person.color}0A)`,
        }}
      >
        <div className="mb-[18px] flex items-center justify-between">
          <button onClick={onBack} className="rounded-pill bg-card p-[9px] shadow-card">
            <ChevronLeft size={18} className="text-ink" />
          </button>
          <button onClick={onEdit} className="rounded-pill bg-card p-[9px] shadow-card">
            <Pencil size={15} className="text-ink-2" />
          </button>
        </div>
        <Avatar p={person} size={68} />
        <div className="mt-3 font-serif text-[32px] font-medium text-ink">{person.name}</div>
        <div className="font-sans text-[13.5px] capitalize text-ink-2">
          {person.relationship} · {ageOn(person.birthDate)} years old
        </div>
      </div>

      <div className="px-5 pt-5">
        <Label className="mb-3">{heading}</Label>
        <div
          className={`mb-[26px] grid gap-[10px] ${moments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {moments.map((m) => {
            const Icon = momentIcon[m.key] ?? Sun;
            return (
              <div key={m.key} className="rounded-[18px] bg-card p-4 shadow-card">
                <Icon size={16} style={{ color: person.color }} />
                <div className="mt-[10px]">
                  <Numeral size={38} color="var(--ink)">
                    {m.n}
                  </Numeral>
                </div>
                <div className="mt-[2px] font-sans text-[13.5px] font-semibold text-ink">
                  {m.unit}
                </div>
                <div className="mt-[1px] font-sans text-xs text-ink-3">{m.sub}</div>
              </div>
            );
          })}
        </div>

        {stones.length > 0 ? (
          <>
            <Label className="mb-3">Milestones ahead</Label>
            <div className="mb-[26px] flex flex-col gap-2">
              {stones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-[14px] bg-card-soft px-[14px] py-3 shadow-[inset_0_0_0_1px_var(--line)]"
                >
                  <span className="text-xl leading-none">{m.emoji}</span>
                  <span className="flex-1 font-sans text-sm text-ink">{m.title}</span>
                  <span className="font-sans text-[12.5px] text-ink-3">
                    {parseISO(m.date).getFullYear()}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <Label className="mb-3">
          {mems.length} {mems.length === 1 ? "moment" : "moments"} together
        </Label>
        {mems.length === 0 ? (
          <div className="py-3 font-sans text-[13.5px] text-ink-3">
            None yet. The small ones matter most.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {mems.map((m) => (
              <div key={m.id} className="rounded-[14px] bg-card px-[14px] py-3 shadow-card">
                <div className="flex justify-between gap-[10px]">
                  <span className="font-sans text-sm font-semibold text-ink">{m.title}</span>
                  <span className="whitespace-nowrap font-sans text-xs text-ink-3">
                    {parseISO(m.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {m.note ? (
                  <div className="mt-[3px] font-sans text-[13px] text-ink-2">{m.note}</div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
