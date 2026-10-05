/** A start month and an end month ("" = Present). Months are "YYYY-MM". */
export type Period = { start: string; end: string };

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export const isMonth = (value: unknown): value is string => typeof value === "string" && MONTH_RE.test(value);

export function toMonth(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function splitMonth(value: string) {
  const [y, m] = value.split("-").map(Number);
  return { year: y, month: m };
}

export function currentMonth() {
  const d = new Date();
  return toMonth(d.getFullYear(), d.getMonth() + 1);
}

/** "2026-08" → "Aug 2026" */
export function formatMonth(value: string) {
  if (!isMonth(value)) return "";
  const { year, month } = splitMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Aug 2026 — May 2030", "Aug 2025 — Present", or a single month when start = end. */
export function formatPeriod(period: Period | undefined) {
  if (!period || !isMonth(period.start)) return "";
  if (period.end === period.start) return formatMonth(period.start);
  return `${formatMonth(period.start)} — ${period.end ? formatMonth(period.end) : "Present"}`;
}

/** LinkedIn-style length, counting both months: "1 yr 2 mos", "3 mos", "1 mo". */
export function formatDuration(period: Period | undefined) {
  if (!period || !isMonth(period.start)) return "";
  const end = period.end || currentMonth();
  const a = splitMonth(period.start);
  const b = splitMonth(end);
  const months = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  if (months <= 0) return "";
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

/** Validate untrusted input; returns null when invalid. With `optional`, no dates is allowed. */
export function coercePeriod(input: unknown, optional = false): Period | null {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const start = src.start ?? "";
  const end = src.end ?? "";
  if (optional && start === "" && end === "") return { start: "", end: "" };
  if (!isMonth(start)) return null;
  if (end !== "" && (!isMonth(end) || end < start)) return null;
  return { start, end: end as string };
}

/** Database date ("2026-08-01") ↔ month ("2026-08"). */
export const monthFromDate = (date: unknown) => (typeof date === "string" ? date.slice(0, 7) : "");
export const dateFromMonth = (month: string) => (month ? `${month}-01` : null);
