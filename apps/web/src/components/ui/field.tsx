import { Label } from "./label";

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="mb-[14px]">
      <Label className="mb-[7px]">{label}</Label>
      {children}
      {error ? (
        <div className="mt-1 font-sans text-xs text-brand-ink">{error}</div>
      ) : null}
    </div>
  );
}
