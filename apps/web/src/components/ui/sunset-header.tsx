/**
 * Warm sunset gradient header — the shared visual signature across tabs.
 * Negative top margin bleeds the gradient into the AppShell's top padding so
 * there's no canvas strip above the sunset.
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
    <div className="bg-sunset -mt-[14px] px-5 pb-[22px] pt-5">
      {overline ? (
        <div className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-2/80">
          {overline}
        </div>
      ) : null}
      <h1 className="mt-1 font-serif text-[32px] font-medium leading-[1.05] text-ink">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 font-sans text-[13.5px] text-ink-2">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}
