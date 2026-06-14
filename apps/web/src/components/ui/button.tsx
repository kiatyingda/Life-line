import { cn } from "@/lib/cn";

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-field px-[18px] py-3 font-sans text-sm font-semibold transition active:brightness-95 disabled:opacity-50",
        variant === "primary"
          ? "bg-brand text-[#FFF7F2]"
          : "bg-transparent text-ink-2 ring-1 ring-inset ring-line-2",
        className,
      )}
    >
      {children}
    </button>
  );
}
