"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { parseISO, type Person } from "@lifelines/core";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <div>
      <SunsetHeader
        overline="Journal"
        title="Moments"
        subtitle={`${memories.length} kept so far`}
      >
        <button
          onClick={onAdd}
          className="press mt-4 inline-flex items-center gap-2 rounded-pill bg-brand px-4 py-[9px] font-sans text-[13px] font-semibold text-[#FFF7F2] shadow-card"
          aria-label="Add a moment"
        >
          <Plus size={16} />
          Keep a moment
        </button>
      </SunsetHeader>

      <div className="px-5 pt-5">
        {memories.length === 0 ? (
          <div className="rounded-card bg-card p-6 text-center shadow-card">
            <div className="mb-3 flex justify-center">
              <Sunrise size={80} tone="soft" />
            </div>
            <p className="font-serif text-[19px] font-medium leading-snug text-ink">
              The small ones matter most.
            </p>
            <p className="mt-2 font-sans text-[13px] text-ink-3">
              Keep your first moment above.
            </p>
          </div>
        ) : null}
        {Object.entries(byMonth).map(([month, items]) => (
          <div key={month} className="mb-[22px]">
            <Label className="mb-[10px]">{month}</Label>
            <div className="flex flex-col gap-[10px]">
              {items.map((m) => (
                <Card key={m.id} className="p-4">
                  <div className="flex items-baseline justify-between gap-[10px]">
                    <span className="font-serif text-lg font-medium text-ink">{m.title}</span>
                    <span className="whitespace-nowrap font-sans text-xs text-ink-3">
                      {parseISO(m.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {m.note ? (
                    <div className="mt-1 font-sans text-[13.5px] leading-snug text-ink-2">
                      {m.note}
                    </div>
                  ) : null}
                  <div className="mt-3 flex">
                    {m.personIds.map((id, i) =>
                      pmap[id] ? (
                        <div key={id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                          <Avatar p={pmap[id]} size={26} />
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
