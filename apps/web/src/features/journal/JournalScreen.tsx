"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { parseISO, type Person } from "@lifelines/core";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SunsetHeader } from "@/components/ui/sunset-header";
import { Sunrise } from "@/components/ui/sunrise";

export function JournalScreen({ onAdd }: { onAdd: () => void }) {
  const memories = useAppStore((s) => s.memories);
  const people = useAppStore((s) => s.people);
  const pmap = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])) as Record<string, Person>,
    [people],
  );

  const byMonth = useMemo(() => {
    const groups: Record<string, typeof memories> = {};
    [...memories]
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .forEach((m) => {
        const key = parseISO(m.date).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        });
        (groups[key] ??= []).push(m);
      });
    return groups;
  }, [memories]);

  return (
    <div className="screen-in">
      <SunsetHeader
        overline="Moments"
        title="Your moments"
        subtitle={
          memories.length === 0
            ? "The small ones matter most."
            : `${memories.length} ${memories.length === 1 ? "kept" : "kept so far"}`
        }
      >
        <button
          onClick={onAdd}
          className="press mt-5 inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-[10px] font-sans text-[13.5px] font-bold text-[#FFF7F2] shadow-card"
          aria-label="Keep a moment"
        >
          <Plus size={16} strokeWidth={2.6} />
          Keep a moment
        </button>
      </SunsetHeader>

      <div className="px-5 pt-6">
        {memories.length === 0 ? (
          <div className="rounded-card bg-card p-8 text-center shadow-card">
            <div className="mb-4 flex justify-center">
              <Sunrise size={88} tone="soft" />
            </div>
            <p
              className="font-sans text-[20px] font-extrabold leading-snug text-ink"
              style={{ letterSpacing: "-0.02em" }}
            >
              Nothing kept yet.
            </p>
            <p className="mt-2 font-sans text-[13.5px] font-medium text-ink-3">
              Tap <span className="font-bold text-ink-2">Keep a moment</span> above to start.
            </p>
          </div>
        ) : null}
        {Object.entries(byMonth).map(([month, items]) => (
          <div key={month} className="mb-7">
            <div className="mb-3 font-sans text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {month}
            </div>
            <div className="flex flex-col gap-3">
              {items.map((m) => (
                <Card key={m.id} className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-sans text-[16px] font-bold text-ink">{m.title}</span>
                    <span className="whitespace-nowrap font-sans text-[12px] font-medium text-ink-3">
                      {parseISO(m.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {m.note ? (
                    <div className="mt-2 font-sans text-[13.5px] leading-snug text-ink-2">
                      {m.note}
                    </div>
                  ) : null}
                  <div className="mt-4 flex">
                    {m.personIds.map((id, i) =>
                      pmap[id] ? (
                        <div key={id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                          <Avatar p={pmap[id]} size={28} />
                        </div>
                      ) : null,
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
