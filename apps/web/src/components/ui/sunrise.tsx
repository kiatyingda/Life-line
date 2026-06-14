/**
 * Sunrise illustration — half-sun resting on a horizon, with seven rays.
 * Replaces the 🌅 emoji as the product's warm visual anchor.
 *
 * Pure SVG, scales to any size, takes a `tone` to fit the surface it's on
 * (the sunset hero already carries the gradient; the empty-card variant
 * needs slightly stronger contrast against cream).
 */
export function Sunrise({
  size = 96,
  tone = "warm",
}: {
  size?: number;
  tone?: "warm" | "soft";
}) {
  const rayColor = tone === "warm" ? "#9A5132" : "#B07150";
  const horizonColor = tone === "warm" ? "#7A4128" : "#9A5132";
  const sunTop = "#FBE5A8";
  const sunBottom = "#F3B97A";
  const gradId = "lifelines-sun-grad";

  return (
    <svg
      width={size}
      height={(size * 80) / 120}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="60" y1="34" x2="60" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={sunTop} />
          <stop offset="100%" stopColor={sunBottom} />
        </linearGradient>
      </defs>

      {/* sun rays — top, two upper-diagonals, two sides, two lower-diagonals */}
      <g stroke={rayColor} strokeWidth="1.6" strokeLinecap="round" opacity="0.72">
        <line x1="60" y1="14" x2="60" y2="5" />
        <line x1="36" y1="22" x2="29" y2="15" />
        <line x1="84" y1="22" x2="91" y2="15" />
        <line x1="20" y1="42" x2="11" y2="42" />
        <line x1="100" y1="42" x2="109" y2="42" />
        <line x1="28" y1="58" x2="21" y2="64" />
        <line x1="92" y1="58" x2="99" y2="64" />
      </g>

      {/* sun (semicircle resting on horizon) */}
      <path d="M 30 64 A 30 30 0 0 1 90 64 Z" fill={`url(#${gradId})`} />

      {/* horizon */}
      <line
        x1="6"
        y1="64"
        x2="114"
        y2="64"
        stroke={horizonColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
