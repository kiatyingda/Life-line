import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={cn(
      "w-full rounded-field bg-card px-[14px] py-3 font-sans text-[15px] text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none transition placeholder:text-ink-4 focus:shadow-[inset_0_0_0_1.5px_var(--brand)]",
      className,
    )}
  />
));
TextInput.displayName = "TextInput";
