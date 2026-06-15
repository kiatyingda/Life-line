"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/**
 * Bottom sheet. Rendered without a Portal so it overlays the app frame
 * (not the full viewport) on desktop. Frame is the positioned ancestor.
 *
 * Always dismissible — first-run onboarding lives in OnboardingScreen
 * (full-screen), not in a sheet. Sheets are for secondary actions.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="sheet-overlay absolute inset-0 z-40 bg-[rgba(30,26,20,0.32)] backdrop-blur-[2px]" />
      <Dialog.Content
        className="sheet-content no-scrollbar absolute inset-x-0 bottom-0 z-50 max-h-[88%] overflow-y-auto rounded-t-sheet bg-canvas px-6 pb-8 pt-3 shadow-lift focus:outline-none"
        aria-describedby={undefined}
      >
        <div className="mx-auto mb-[18px] mt-2 h-[5px] w-[44px] rounded-pill bg-ink-4/50" />
        <div className="mb-5 flex items-center justify-between">
          <Dialog.Title
            className="font-sans text-[22px] font-extrabold text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="press grid h-9 w-9 place-items-center rounded-pill bg-card shadow-card"
            aria-label="Close"
          >
            <X size={16} className="text-ink-2" strokeWidth={2.4} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
