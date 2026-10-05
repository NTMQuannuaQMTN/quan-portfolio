"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ITEM_H = 36;
const VISIBLE = 5; // odd, so one row sits in the middle
const PAD = ((VISIBLE - 1) / 2) * ITEM_H;

export type WheelItem<T extends string | number> = { value: T; label: string };

/**
 * iOS-style scroll wheel: scroll, drag, mouse-wheel, click a row, or use the
 * keyboard (↑/↓, Page Up/Down, Home/End). The centred row is the selection.
 */
export default function WheelPicker<T extends string | number>({
  items,
  value,
  onChange,
  label,
  disabled = false,
  className = "",
}: {
  items: WheelItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Row a smooth scroll is heading to, so repeated key presses add up.
  const target = useRef<number | null>(null);
  // Selection not committed yet (still settling); flushed on unmount.
  const pending = useRef<(() => void) | null>(null);
  const selected = Math.max(0, items.findIndex((i) => i.value === value));
  // Row under the centre line while scrolling (for live highlighting).
  const [live, setLive] = useState(selected);

  // Keep the wheel on the selected row when the value changes from outside.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && Math.round(el.scrollTop / ITEM_H) !== selected) el.scrollTop = selected * ITEM_H;
  }, [selected]);

  // Closing the picker mid-scroll still keeps the row under the centre line.
  useEffect(
    () => () => {
      clearTimeout(settleTimer.current);
      pending.current?.();
    },
    []
  );

  function scrollToIndex(index: number, smooth = true) {
    const clamped = Math.min(items.length - 1, Math.max(0, index));
    target.current = clamped;
    ref.current?.scrollTo({ top: clamped * ITEM_H, behavior: smooth ? "smooth" : "instant" });
  }

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const index = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
    setLive(index);
    // Commit once scrolling has settled (works where `scrollend` isn't supported).
    clearTimeout(settleTimer.current);
    pending.current =
      items[index] && items[index].value !== value ? () => onChange(items[index].value) : null;
    settleTimer.current = setTimeout(() => {
      target.current = null;
      pending.current?.();
      pending.current = null;
    }, 120);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      PageUp: -5,
      PageDown: 5,
      Home: -items.length,
      End: items.length,
    };
    if (!(e.key in step)) return;
    e.preventDefault();
    scrollToIndex((target.current ?? live) + step[e.key]);
  }

  return (
    <div className={`relative select-none ${disabled ? "pointer-events-none opacity-40" : ""} ${className}`}>
      {/* Selection band */}
      <div
        className="pointer-events-none absolute inset-x-1 rounded-lg bg-accent-soft ring-1 ring-accent/30"
        style={{ top: PAD, height: ITEM_H }}
      />
      <div
        ref={ref}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={selected}
        aria-valuetext={items[selected]?.label}
        aria-disabled={disabled || undefined}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="relative snap-y snap-mandatory overflow-y-scroll rounded-lg outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-scrollbar]:hidden"
        style={{
          height: ITEM_H * VISIBLE,
          paddingBlock: PAD,
          maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}
      >
        {items.map((item, i) => {
          const distance = Math.abs(i - live);
          return (
            <div
              key={item.value}
              onClick={() => scrollToIndex(i)}
              className={`flex snap-center items-center justify-center whitespace-nowrap px-2 text-sm tabular-nums transition-[color,transform] duration-100 ${
                distance === 0 ? "font-semibold text-accent" : "cursor-pointer text-muted"
              }`}
              style={{
                height: ITEM_H,
                transform: `perspective(400px) rotateX(${Math.min(distance, 3) * 18 * Math.sign(i - live)}deg) scale(${1 - Math.min(distance, 3) * 0.06})`,
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
