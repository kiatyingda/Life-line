import type { Person } from "@lifelines/core";

/**
 * Derive 1–2 letter initials from a person's name.
 * "Me" → "M". "Mary Jane" → "MJ". "Mary Jane Smith" → "MS".
 */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/**
 * Initials avatar in the person's color. Replaces the earlier emoji avatar —
 * no emoticons in the product, just identity through warm color + serif letter.
 */
export function Avatar({ p, size = 40 }: { p: Person; size?: number }) {
  return (
    <div
      className="grid shrink-0 select-none place-items-center leading-none"
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `${p.color}1C`,
        boxShadow: `inset 0 0 0 1.5px ${p.color}38`,
      }}
    >
      <span
        className="font-serif font-medium"
        style={{ color: p.color, fontSize: size * 0.42 }}
      >
        {initials(p.name)}
      </span>
    </div>
  );
}
