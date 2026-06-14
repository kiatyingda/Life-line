"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/**
 * Bottom sheet. Rendered without a Portal so it overlays the app frame
 * (not the full viewport) on desktop. Frame is the positioned ancestor.
 *
 * Set `dismissible={false}` for blocking flows (e.g. first-run onboarding):
 * the close affordance, esc, and outside-click all stop dismissing.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  dismissible = true,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  children: React.ReactNode;
  dismissible?: boolean;
}) {
  const block = (e: Event) => e.preventDefault();
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!dismissible && !o) return;
        onOpenChange(o);
      }}
    >
      <Dialog.Overlay className="sheet-overlay absolute inset-0 z-40 bg-[rgba(30,26,20,0.32)] backdrop-blur-[2px]" />
      <Dialog.Content
        className="sheet-content no-scrollbar absolute inset-x-0 bottom-0 z-50 max-h-[86%] overflow-y-auto rounded-t-sheet bg-canvas px-5 pb-7 pt-[10px] shadow-lift focus:outline-none"
        aria-describedby={undefined}
        onEscapeKeyDown={dismissible ? undefined : block}
        onPointerDownOutside={dismissible ? undefined : block}
        onInteractOutside={dismissible ? undefined : block}
      >
        <div className="mx-auto mb-[14px] mt-2 h-1 w-[38px] rounded-pill bg-line-2" />
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="font-serif text-[22px] font-medium text-ink">
            {title}
          </Dialog.Title>
          {dismissible ? (
            <Dialog.Close className="rounded-pill bg-card p-2 shadow-card">
              <X size={16} className="text-ink-2" />
            </Dialog.Close>
          ) : null}
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
