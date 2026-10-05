"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Text clamped to a few lines with a LinkedIn-style "…see more" toggle. */
export default function SeeMore({ text, lines = 3, className = "" }: { text: string; lines?: number; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, open]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className="whitespace-pre-line text-sm leading-relaxed"
        style={open ? undefined : { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {/* While collapsed, drop blank lines so an empty line can't become the clamped "…" line. */}
        {open ? text : text.replace(/\n\s*\n/g, "\n")}
      </p>
      {(overflows || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-0.5 text-sm font-semibold text-muted hover:text-accent hover:underline"
        >
          {open ? "see less" : "…see more"}
        </button>
      )}
    </div>
  );
}
