"use client";

import { Home, BookOpen, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type Tab = "home" | "moments";

const TABS: ReadonlyArray<readonly [Tab, LucideIcon, string]> = [
  ["home", Home, "Home"],
  ["moments", BookOpen, "Moments"],
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
    <button onClick={onClick} className="press flex w-[72px] flex-col items-center gap-1">
      <Icon
        size={22}
        strokeWidth={active ? 2.5 : 2}
        className={active ? "text-brand" : "text-ink-3"}
      />
      <span
        className={cn(
          "font-sans text-[11px]",
          active ? "font-bold text-brand" : "font-semibold text-ink-3",
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
  const [home, moments] = TABS;
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[80px] items-center justify-around border-t border-line bg-[rgba(244,240,233,0.92)] pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-[14px]">
      <TabBtn
        active={tab === home[0]}
        Icon={home[1]}
        label={home[2]}
        onClick={() => onTab(home[0])}
      />
      <button
        onClick={onAdd}
        aria-label="Add"
        className="press -mt-[18px] grid h-[56px] w-[56px] place-items-center rounded-pill bg-brand shadow-[0_10px_24px_rgba(188,106,69,0.42)]"
      >
        <Plus size={26} className="text-[#FFF7F2]" strokeWidth={2.6} />
      </button>
      <TabBtn
        active={tab === moments[0]}
        Icon={moments[1]}
        label={moments[2]}
        onClick={() => onTab(moments[0])}
      />
    </div>
  );
}
