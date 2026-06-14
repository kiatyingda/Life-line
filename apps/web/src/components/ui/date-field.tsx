"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const PAD = (s: string) => s.padStart(2, "0");
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Three-segment date picker (Day · Month · Year). Always emits ISO yyyy-mm-dd
 * once all three parts are valid; otherwise emits empty string. Removes the
 * dd/mm vs mm/dd locale trap of <input type="date">.
 */
export function DateField({
  value,
  onChange,
  fromYear = 1920,
  toYear = CURRENT_YEAR,
}: {
  value: string;
  onChange: (iso: string) => void;
  fromYear?: number;
  toYear?: number;
}) {
  // Local d/m/y mirrors the parent ISO. Mid-edit values (e.g. typing "1990"
  // one digit at a time) stay local until the trio is complete and valid.
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");

  // Hydrate from parent ISO whenever it changes externally.
  useEffect(() => {
    if (!value) {
      setD("");
      setM("");
      setY("");
      return;
    }
    const [yy, mm, dd] = value.split("-");
    setY(yy ?? "");
    setM(mm ? String(Number(mm)) : "");
    setD(dd ? String(Number(dd)) : "");
  }, [value]);

  const emit = (nd: string, nm: string, ny: string) => {
    const dn = Number(nd);
    const mn = Number(nm);
    const yn = Number(ny);
    if (
      nd === "" ||
      nm === "" ||
      ny === "" ||
      !Number.isFinite(dn) ||
      !Number.isFinite(mn) ||
      !Number.isFinite(yn) ||
      dn < 1 ||
      dn > 31 ||
      mn < 1 ||
      mn > 12 ||
      yn < fromYear ||
      yn > toYear
    ) {
      onChange("");
      return;
    }
    onChange(`${ny}-${PAD(nm)}-${PAD(nd)}`);
  };

  const inputCls =
    "w-full rounded-field bg-card px-3 py-3 font-sans text-[15px] text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none transition placeholder:text-ink-4 focus:shadow-[inset_0_0_0_1.5px_var(--brand)]";

  return (
    <div className="flex gap-2">
      <input
        aria-label="Day"
        inputMode="numeric"
        type="number"
        min={1}
        max={31}
        placeholder="DD"
        value={d}
        onChange={(e) => {
          setD(e.target.value);
          emit(e.target.value, m, y);
        }}
        className={`${inputCls} w-[64px] text-center`}
      />
      <select
        aria-label="Month"
        value={m}
        onChange={(e) => {
          setM(e.target.value);
          emit(d, e.target.value, y);
        }}
        className={`${inputCls} flex-1 appearance-none`}
      >
        <option value="" disabled>
          Month
        </option>
        {MONTHS.map((label, i) => (
          <option key={label} value={i + 1}>
            {label}
          </option>
        ))}
      </select>
      <input
        aria-label="Year"
        inputMode="numeric"
        type="number"
        min={fromYear}
        max={toYear}
        placeholder="YYYY"
        value={y}
        onChange={(e) => {
          setY(e.target.value);
          emit(d, m, e.target.value);
        }}
        className={`${inputCls} w-[88px] text-center`}
      />
    </div>
  );
}
