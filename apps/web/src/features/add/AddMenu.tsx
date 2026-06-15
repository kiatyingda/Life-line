"use client";

import { UserPlus, BookmarkPlus, ChevronRight, type LucideIcon } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";

/**
 * Bottom-sheet choose-what-to-add menu. Triggered by the + tab; routes to
 * either the PersonSheet or the MemorySheet on the parent.
 */
export function AddMenu({
  open,
  onOpenChange,
  onAddPerson,
  onAddMoment,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAddPerson: () => void;
  onAddMoment: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Add">
      <div className="-mt-1 flex flex-col gap-3">
        <Row
          Icon={UserPlus}
          title="Add a person"
          subtitle="Someone whose time matters"
          onClick={() => {
            onOpenChange(false);
            onAddPerson();
          }}
        />
        <Row
          Icon={BookmarkPlus}
          title="Keep a moment"
          subtitle="Something worth remembering"
          onClick={() => {
            onOpenChange(false);
            onAddMoment();
          }}
        />
      </div>
    </Sheet>
  );
}

function Row({
  Icon,
  title,
  subtitle,
  onClick,
}: {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press flex items-center gap-4 rounded-card bg-card p-4 text-left shadow-card"
    >
      <span className="grid h-12 w-12 place-items-center rounded-pill bg-brand-soft">
        <Icon size={20} className="text-brand-ink" strokeWidth={2.4} />
      </span>
      <span className="flex-1">
        <span className="block font-sans text-[16px] font-bold text-ink">{title}</span>
        <span className="block font-sans text-[13px] font-medium text-ink-3">
          {subtitle}
        </span>
      </span>
      <ChevronRight size={18} className="text-ink-4" strokeWidth={2.4} />
    </button>
  );
}
