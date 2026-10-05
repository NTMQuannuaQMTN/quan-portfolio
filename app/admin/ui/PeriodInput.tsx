"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { MONTHS_LONG, currentMonth, formatMonth, splitMonth, toMonth, type Period } from "@/lib/period";
import WheelPicker, { type WheelItem } from "./WheelPicker";

const MONTH_ITEMS: WheelItem<number>[] = MONTHS_LONG.map((label, i) => ({ value: i + 1, label }));

function yearItems(...include: string[]): WheelItem<number>[] {
  const now = new Date().getFullYear();
  const years = include.filter(Boolean).map((m) => splitMonth(m).year);
  const from = Math.min(1990, ...years);
  const to = Math.max(now + 10, ...years);
  return Array.from({ length: to - from + 1 }, (_, i) => ({ value: from + i, label: String(from + i) }));
}

/**
 * LinkedIn-style dates: a "currently" checkbox, then Start date and End date
 * fields that open a month/year wheel. With `optional`, dates can be left empty.
 */
export default function PeriodInput({
  value,
  onChange,
  optional = false,
  currentLabel = "Current",
}: {
  value: Period | undefined;
  onChange: (value: Period) => void;
  optional?: boolean;
  currentLabel?: string;
}) {
  const period: Period = value ?? (optional ? { start: "", end: "" } : { start: currentMonth(), end: "" });
  const hasStart = Boolean(period.start);
  const current = hasStart && period.end === "";
  const years = yearItems(period.start, period.end);
  const checkboxId = useId();

  // Keep end ≥ start by moving the other side along.
  function setStart(start: string) {
    const end = !hasStart && optional ? start : period.end && period.end < start ? start : period.end;
    onChange({ start, end });
  }
  function setEnd(end: string) {
    onChange({ start: period.start, end: end < period.start ? period.start : end });
  }
  function setCurrent(on: boolean) {
    const start = period.start || currentMonth();
    if (on) return onChange({ start, end: "" });
    const now = currentMonth();
    onChange({ start, end: now < start ? start : now });
  }

  return (
    <div className="space-y-2">
      <label htmlFor={checkboxId} className="flex w-fit cursor-pointer items-center gap-2 text-sm">
        <input
          id={checkboxId}
          type="checkbox"
          checked={current}
          onChange={(e) => setCurrent(e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        {currentLabel}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <MonthField label="Start date" value={period.start} years={years} onChange={setStart} placeholder="Select" />
        <MonthField
          label="End date"
          value={current ? "" : period.end}
          years={years}
          onChange={setEnd}
          placeholder={current ? "Present" : "Select"}
          disabled={!hasStart || current}
          fallback={period.start}
        />
      </div>

      {optional && hasStart && (
        <button
          type="button"
          onClick={() => onChange({ start: "", end: "" })}
          className="text-xs font-medium text-muted hover:text-accent"
        >
          Clear dates
        </button>
      )}
    </div>
  );
}

/** A button showing "Aug 2026" that opens a month + year wheel in a popover. */
function MonthField({
  label,
  value,
  years,
  onChange,
  placeholder,
  disabled = false,
  fallback,
}: {
  label: string;
  value: string;
  years: WheelItem<number>[];
  onChange: (month: string) => void;
  placeholder: string;
  disabled?: boolean;
  /** Where the wheel starts when there's no value yet. */
  fallback?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  // Close on outside click / Escape. The selection is kept (the wheel commits on close).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openPicker() {
    // Picking for the first time: start from the fallback (or this month) right away.
    if (!value) onChange(fallback || currentMonth());
    setOpen(true);
  }

  const shown = value || (open ? fallback || currentMonth() : "");
  const { year, month } = splitMonth(shown || currentMonth());

  // Latest month, so the month and year wheels can both commit in the same tick
  // (e.g. both flushing when the popover closes) without overwriting each other.
  const latest = useRef(shown);
  useLayoutEffect(() => {
    latest.current = shown;
  }, [shown]);

  function commit(part: { year?: number; month?: number }) {
    const cur = splitMonth(latest.current || fallback || currentMonth());
    const next = toMonth(part.year ?? cur.year, part.month ?? cur.month);
    latest.current = next;
    onChange(next);
  }

  return (
    <div ref={rootRef} className="relative">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        className={`flex h-10 w-full items-center gap-2 rounded-lg border bg-bg px-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? "border-accent ring-2 ring-accent-soft" : "border-line hover:border-muted"
        }`}
      >
        <CalendarDays size={15} className="shrink-0 text-muted" />
        <span className={`flex-1 truncate ${shown ? "" : "text-muted"}`}>{shown ? formatMonth(shown) : placeholder}</span>
        <ChevronDown size={15} className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-full z-30 mt-1 w-64 rounded-xl border border-line bg-card p-2 shadow-2xl"
        >
          <div className="grid grid-cols-[3fr_2fr] gap-1">
            <WheelPicker
              label={`${label} month`}
              items={MONTH_ITEMS}
              value={month}
              onChange={(m) => commit({ month: m })}
            />
            <WheelPicker
              label={`${label} year`}
              items={years}
              value={year}
              onChange={(y) => commit({ year: y })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
