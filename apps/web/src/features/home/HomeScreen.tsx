"use client";

import { useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  momentsFor,
  nextBirthday,
  daysBetween,
  parseISO,
  insightsFor,
  type Person,
} from "@lifelines/core";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Numeral } from "@/components/ui/numeral";
import { Avatar } from "@/components/ui/avatar";
import { insightIcon } from "@/lib/icons";

function Greeting() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="mb-[18px]">
      <Label>{date}</Label>
      <div className="mt-1 font-serif text-[26px] font-medium text-ink">
        Good {part}.
      </div>
    </div>
  );
}

export function HomeScreen({ onPerson }: { onPerson: (id: string) => void }) {
  const people = useAppStore((s) => s.people);
  const milestones = useAppStore((s) => s.milestones);
  const self = useAppStore(selectSelf);
  const others = useMemo(
    () => people.filter((p) => p.relationship !== "self"),
    [people],
  );

  const ranked = useMemo(
    () =>
      others
        .map((p) => ({ p, m: momentsFor(p, self)[0]! }))
        .sort((a, b) => a.m.n - b.m.n),
    [others, self],
  );
  const hero = ranked[0];
  const surfaced = ranked.slice(0, 3);
  const insights = useMemo(() => insightsFor(people), [people]);

  const upcoming = useMemo(() => {
    const events = [
      ...people.map((p) => ({
        when: nextBirthday(p.birthDate),
        label: `${p.name.split(" ")[0]}'s birthday`,
        emoji: "🎂",
      })),
      ...milestones.map((m) => ({ when: parseISO(m.date), label: m.title, emoji: m.emoji })),
    ]
      .map((e) => ({ ...e, days: daysBetween(e.when) }))
      .filter((e) => e.days >= 0)
      .sort((a, b) => a.days - b.days);
    return events.slice(0, 2);
  }, [people, milestones]);

  if (!hero) {
    return (
      <div className="px-5 pb-4 pt-2">
        <Greeting />
        <p className="font-sans text-sm text-ink-2">Add someone you love to begin.</p>
      </div>
    );
  }

  const Insight0 = insights[0];

  return (
    <div className="px-5 pb-4 pt-2">
      <Greeting />

      {/* HERO — the shared window, framed as opportunity */}
      <div className="mb-[26px]">
        <div className="flex flex-wrap items-baseline gap-[10px]">
          <Numeral size={68} color="var(--brand)">
            {hero.m.n}
          </Numeral>
          <span className="font-serif text-[30px] font-medium text-ink">
            {hero.m.unit} left
          </span>
        </div>
        <div className="mt-[2px] font-serif text-[30px] font-medium text-ink">
          with {hero.p.name}.
        </div>
        <p className="mt-[10px] font-sans text-sm leading-relaxed text-ink-2">
          That&apos;s the time you have together while you have it. Make one of them count.
        </p>
      </div>

      {/* people row */}
      <div className="no-scrollbar mb-[22px] flex gap-4 overflow-x-auto pb-[6px]">
        {people.map((p) => (
          <button
            key={p.id}
            onClick={() => onPerson(p.id)}
            className="flex flex-col items-center gap-[7px]"
          >
            <Avatar p={p} size={54} />
            <span className="font-sans text-xs font-semibold text-ink-2">{p.name}</span>
          </button>
        ))}
      </div>

      {/* surfaced moments */}
      <Label className="mb-3">Time, together</Label>
      <div className="mb-[26px] flex flex-col gap-[10px]">
        {surfaced.map(({ p, m }) => (
          <Card
            key={p.id}
            onClick={() => onPerson(p.id)}
            className="flex items-center gap-[14px] p-4"
          >
            <Avatar p={p} size={42} />
            <div className="flex-1">
              <div className="flex items-baseline gap-[7px]">
                <Numeral size={30} color={p.color}>
                  {m.n}
                </Numeral>
                <span className="font-sans text-sm font-semibold text-ink">{m.unit}</span>
              </div>
              <div className="mt-[1px] font-sans text-[12.5px] text-ink-3">
                {m.sub} · {p.name}
              </div>
            </div>
            <ArrowRight size={16} className="text-ink-4" />
          </Card>
        ))}
      </div>

      {/* insight */}
      {Insight0 ? (
        <>
          <Label className="mb-3">Worth remembering</Label>
          <div className="mb-[26px] rounded-card bg-brand-soft p-[18px]">
            <div className="flex gap-3">
              <Sparkles size={18} className="mt-[2px] shrink-0 text-brand-ink" />
              <span className="font-serif text-lg font-medium leading-snug text-brand-ink">
                {Insight0.text}
              </span>
            </div>
          </div>
        </>
      ) : null}

      {/* coming up */}
      <Label className="mb-3">Coming up</Label>
      <div className="flex flex-col gap-2">
        {upcoming.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[14px] bg-card-soft px-[14px] py-3 shadow-[inset_0_0_0_1px_var(--line)]"
          >
            <span className="text-xl leading-none">{e.emoji}</span>
            <span className="flex-1 font-sans text-sm text-ink">{e.label}</span>
            <span className="font-sans text-[12.5px] font-semibold text-ink-3">
              {e.days === 0 ? "today" : `in ${e.days}d`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
