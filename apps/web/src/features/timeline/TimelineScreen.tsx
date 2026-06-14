"use client";

import { useState } from "react";
import { Home as HomeIcon } from "lucide-react";
import { yearOf, ADULT_AGE, type Milestone } from "@lifelines/core";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Segmented } from "@/components/ui/segmented";
import { SunsetHeader } from "@/components/ui/sunset-header";

type Zoom = "life" | "mid" | "near";

function Track({
  children,
  decades,
  pct,
  nowX,
}: {
  children: React.ReactNode;
  decades: number[];
  pct: (y: number) => number;
  nowX: number;
}) {
  return (
    <div className="relative h-[22px]">
      {decades.map((y) => (
        <div
          key={y}
          className="absolute bottom-0 top-0 w-0 border-l border-line"
          style={{ left: `${pct(y)}%` }}
        />
      ))}
      <div
        className="absolute -bottom-[3px] -top-[3px] w-0 border-l-2 border-brand"
        style={{ left: `${nowX}%` }}
      />
      {children}
    </div>
  );
}

function Dot({ x, color }: { x: number; color: string }) {
  return (
    <div
      className="absolute z-[2] h-[12px] w-[12px] rounded-pill"
      style={{
        top: "50%",
        left: `${x}%`,
        transform: "translate(-50%,-50%)",
        background: color,
        boxShadow: `0 0 0 2.5px var(--card), 0 2px 5px rgba(42,38,32,0.14)`,
      }}
    />
  );
}

function Row({
  label,
  avatar,
  children,
}: {
  label: React.ReactNode;
  avatar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[14px] flex items-center gap-2">
      <div className="flex w-[86px] shrink-0 items-center gap-[7px]">
        {avatar}
        {label}
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

export function TimelineScreen() {
  const people = useAppStore((s) => s.people);
  const milestones = useAppStore((s) => s.milestones);
  const [zoom, setZoom] = useState<Zoom>("life");

  const t = new Date();
  const nowY = t.getFullYear() + t.getMonth() / 12;

  const births = people.map((p) => yearOf(p.birthDate));
  const horizons = people.map((p) => yearOf(p.birthDate) + p.lifeExpectancy);

  const windows: Record<Zoom, [number, number]> = {
    life: [Math.min(...births) - 2, Math.min(Math.max(...horizons) + 2, nowY + 80)],
    mid: [Math.floor(nowY) - 2, Math.floor(nowY) + 30],
    near: [Math.floor(nowY) - 1, Math.floor(nowY) + 10],
  };
  const [start, end] = windows[zoom];
  const pct = (y: number) => Math.max(0, Math.min(100, ((y - start) / (end - start)) * 100));

  const decades: number[] = [];
  for (let y = Math.ceil(start / 10) * 10; y <= end; y += 10) decades.push(y);

  const shared: Milestone[] = milestones.filter((m) => !m.personId);

  return (
    <div>
      <SunsetHeader
        overline="Timeline"
        title="Lives, overlapping"
        subtitle="Every band fades toward its horizon — no endings, just distance"
      />

      <div className="px-5 pb-4 pt-5">
        <div className="mb-5">
          <Segmented<Zoom>
            value={zoom}
            onChange={setZoom}
            options={[
              ["life", "Lifetime"],
              ["mid", "30 yrs"],
              ["near", "10 yrs"],
            ]}
          />
        </div>

        <Card className="relative overflow-hidden px-[14px] pb-2 pt-4">
          {shared.length > 0 ? (
            <Row
              avatar={
                <span
                  className="grid h-[26px] w-[26px] place-items-center rounded-pill bg-ink-4/30"
                  aria-hidden
                >
                  <HomeIcon size={14} className="text-ink-2" />
                </span>
              }
              label={<Label className="text-[9.5px]">Family</Label>}
            >
              <Track decades={decades} pct={pct} nowX={pct(nowY)}>
                {shared.map((m) => (
                  <Dot key={m.id} x={pct(yearOf(m.date))} color="var(--ink-3)" />
                ))}
              </Track>
            </Row>
          ) : null}

          {people.map((p) => {
            const bY = yearOf(p.birthDate);
            const hY = bY + p.lifeExpectancy;
            const adultX = p.relationship === "child" ? pct(bY + ADULT_AGE) : null;
            const mils = milestones.filter((m) => m.personId === p.id);
            return (
              <Row
                key={p.id}
                avatar={<Avatar p={p} size={26} />}
                label={
                  <span className="font-sans text-[12.5px] font-semibold text-ink-2">{p.name}</span>
                }
              >
                <Track decades={decades} pct={pct} nowX={pct(nowY)}>
                  {/* life band, fading to horizon */}
                  <div
                    className="absolute h-[9px] rounded-pill"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: `${pct(bY)}%`,
                      width: `${Math.max(0, pct(hY) - pct(bY))}%`,
                      background: `linear-gradient(90deg, ${p.color}D9 0%, ${p.color}B0 55%, ${p.color}00 100%)`,
                    }}
                  />
                  {adultX != null ? (
                    <div
                      className="absolute bottom-1 top-1 w-0"
                      style={{ left: `${adultX}%`, borderLeft: `1.5px dashed ${p.color}` }}
                    >
                      <span
                        className="absolute -top-[2px] left-[3px] font-sans text-[9px] font-bold"
                        style={{ color: p.color }}
                      >
                        18
                      </span>
                    </div>
                  ) : null}
                  {mils.map((m) => (
                    <Dot key={m.id} x={pct(yearOf(m.date))} color={p.color} />
                  ))}
                </Track>
              </Row>
            );
          })}

          {/* decade axis */}
          <div className="relative ml-[94px] mt-[2px] h-4">
            {decades.map((y) => (
              <span
                key={y}
                className="absolute font-sans text-[10px] text-ink-4"
                style={{ left: `${pct(y)}%`, transform: "translateX(-50%)" }}
              >
                {y}
              </span>
            ))}
          </div>
        </Card>

        <div className="mt-[14px] flex flex-wrap gap-4">
          <div className="flex items-center gap-[7px]">
            <div
              className="h-[6px] w-4 rounded-pill"
              style={{ background: "linear-gradient(90deg, var(--ink-2), transparent)" }}
            />
            <span className="font-sans text-[11.5px] text-ink-3">A life, fading to its horizon</span>
          </div>
          <div className="flex items-center gap-[7px]">
            <div className="h-3 w-0 border-l-2 border-brand" />
            <span className="font-sans text-[11.5px] text-ink-3">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
