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
        "w-full rounded-pill px-[18px] py-[14px] font-sans text-[14.5px] font-bold transition active:brightness-95 disabled:opacity-50",
        variant === "primary"
          ? "bg-brand text-[#FFF7F2] shadow-[0_8px_18px_rgba(188,106,69,0.32)]"
          : "bg-transparent text-ink-2 ring-1 ring-inset ring-line-2",
        className,
      )}
    >
      {children}
    </button>
  );
}
