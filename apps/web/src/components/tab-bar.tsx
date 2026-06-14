"use client";

import { Home, Users, BookOpen, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type Tab = "home" | "people" | "journal";

const TABS: ReadonlyArray<readonly [Tab, LucideIcon]> = [
  ["home", Home],
  ["people", Users],
  ["journal", BookOpen],
];

function TabBtn({
  active,
  Icon,
  label,
  onClick,
}: {
  active: boolean;
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-[60px] flex-col items-center gap-1">
      <Icon
        size={21}
        strokeWidth={active ? 2.4 : 2}
        className={active ? "text-brand" : "text-ink-3"}
      />
      <span
        className={cn(
          "font-sans text-[10px] capitalize",
          active ? "font-bold text-brand" : "font-medium text-ink-3",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function TabBar({
  tab,
  onTab,
  onAdd,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  onAdd: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[76px] items-center justify-around border-t border-line bg-[rgba(244,240,233,0.9)] pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-[14px]">
      {TABS.slice(0, 2).map(([k, Icon]) => (
        <TabBtn key={k} active={tab === k} Icon={Icon} label={k} onClick={() => onTab(k)} />
      ))}
      <button
        onClick={onAdd}
        aria-label="Add"
        className="press -mt-[14px] grid h-[52px] w-[52px] place-items-center rounded-pill bg-brand shadow-[0_8px_20px_rgba(188,106,69,0.4)]"
      >
        <Plus size={24} className="text-[#FFF7F2]" />
      </button>
      {TABS.slice(2).map(([k, Icon]) => (
        <TabBtn key={k} active={tab === k} Icon={Icon} label={k} onClick={() => onTab(k)} />
      ))}
    </div>
  );
}
