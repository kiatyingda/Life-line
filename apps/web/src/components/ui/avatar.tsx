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
 * Initials avatar in the person's color. Two visual styles:
 *  - `solid` (auto for size < 30): person color fills the disc, white letter.
 *    Higher contrast — legible at chip / list scale.
 *  - tinted (default for larger): pale color background, colored letter
 *    plus a thin inner ring. Softer, sits gracefully in hero contexts.
 */
export function Avatar({
  p,
  size = 40,
  solid,
}: {
  p: Person;
  size?: number;
  solid?: boolean;
}) {
  const useSolid = solid ?? size < 30;

  if (useSolid) {
    return (
      <div
        className="grid shrink-0 select-none place-items-center leading-none"
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          background: p.color,
          boxShadow: `0 1px 2px rgba(42,38,32,0.18)`,
        }}
      >
        <span
          className="font-sans font-extrabold text-[#FFF7F2]"
          style={{ fontSize: size * 0.46, letterSpacing: "-0.02em" }}
        >
          {initials(p.name)}
        </span>
      </div>
    );
  }

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
        className="font-sans font-bold"
        style={{
          color: p.color,
          fontSize: size * 0.42,
          letterSpacing: "-0.02em",
        }}
      >
        {initials(p.name)}
      </span>
    </div>
  );
}
