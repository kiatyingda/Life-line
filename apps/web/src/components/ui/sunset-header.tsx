/**
 * Warm sunset gradient header — the shared visual signature across tabs.
 * Sans-only, Headspace-grade weight, generous breathing room.
 */
export function SunsetHeader({
  overline,
  title,
  subtitle,
  children,
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-sunset -mt-[14px] px-6 pb-8 pt-8">
      {overline ? (
        <div className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-2/80">
          {overline}
        </div>
      ) : null}
      <h1
        className="mt-2 font-sans text-[38px] font-extrabold leading-[1.02] text-ink"
        style={{ letterSpacing: "-0.025em" }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 font-sans text-[14px] font-medium leading-snug text-ink-2">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}
