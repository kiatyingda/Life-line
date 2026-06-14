import type { Person } from "@lifelines/core";

export function Avatar({ p, size = 40 }: { p: Person; size?: number }) {
  return (
    <div
      className="grid shrink-0 select-none place-items-center leading-none"
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `${p.color}1F`,
        boxShadow: `inset 0 0 0 1.5px ${p.color}40`,
        fontSize: size * 0.5,
      }}
    >
      {p.emoji}
    </div>
  );
}
