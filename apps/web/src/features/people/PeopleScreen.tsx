"use client";

import { Cake, Heart, ArrowRight, type LucideIcon } from "lucide-react";
import { momentsFor, ageOn, nextBirthday, daysBetween } from "@lifelines/core";
import { useAppStore, selectSelf } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Numeral } from "@/components/ui/numeral";
import { Avatar } from "@/components/ui/avatar";
import { SunsetHeader } from "@/components/ui/sunset-header";

function Meta({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-[6px]">
      <Icon size={13} className="text-ink-3" />
      <span className="font-sans text-[12.5px] text-ink-3">{text}</span>
    </div>
  );
}

export function PeopleScreen({ onPerson }: { onPerson: (id: string) => void }) {
  const people = useAppStore((s) => s.people);
  const memories = useAppStore((s) => s.memories);
  const self = useAppStore(selectSelf);
  const memCount = (id: string) =>
    memories.filter((m) => m.personIds.includes(id)).length;

  return (
    <div>
      <SunsetHeader
        overline="People"
        title="Your people"
        subtitle="The ones who matter most"
      />
      <div className="flex flex-col gap-3 px-5 pt-5">
        {people.map((p) => {
          const m = momentsFor(p, self)[0]!;
          const age = ageOn(p.birthDate);
          const nb = daysBetween(nextBirthday(p.birthDate));
          const count = memCount(p.id);
          return (
            <Card key={p.id} onClick={() => onPerson(p.id)}>
              <div className="mb-[14px] flex items-center gap-[14px]">
                <Avatar p={p} size={48} />
                <div className="flex-1">
                  <div className="font-sans text-[17px] font-semibold text-ink">{p.name}</div>
                  <div className="font-sans text-[13px] capitalize text-ink-3">
                    {p.relationship} · {age}
                  </div>
                </div>
                <ArrowRight size={16} className="text-ink-4" />
              </div>

              {/* resonant line — NOT a life-progress bar */}
              <div
                className="flex items-baseline gap-2 rounded-[13px] px-[14px] py-3"
                style={{ background: `${p.color}12` }}
              >
                <Numeral size={28} color={p.color}>
                  {m.n}
                </Numeral>
                <div>
                  <span className="font-sans text-sm font-semibold text-ink">{m.unit}</span>
                  <span className="font-sans text-[13px] text-ink-3"> · {m.sub}</span>
                </div>
              </div>

              <div className="mt-3 flex gap-[18px]">
                <Meta icon={Cake} text={nb === 0 ? "Birthday today" : `Birthday in ${nb}d`} />
                <Meta icon={Heart} text={`${count} ${count === 1 ? "moment" : "moments"}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
