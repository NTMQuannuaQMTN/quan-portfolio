"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { currentMonth } from "@/lib/period";
import { listSections, type ListSection } from "@/lib/schemas";
import { saveSection } from "../actions";
import { FieldInput, primaryButton, SaveStatus, secondaryButton, useSaver, type SelectOption } from "./controls";

type Item = Record<string, unknown> & { _key: string };

let keySeq = 0;
const withKey = (item: Record<string, unknown>): Item => ({ ...item, _key: `k${keySeq++}` });

export default function ListEditor({
  section,
  initialItems,
  associationOptions,
}: {
  section: ListSection;
  initialItems: Record<string, unknown>[];
  associationOptions?: SelectOption[];
}) {
  const { fields, itemLabel } = listSections[section];
  const [items, setItems] = useState<Item[]>(() => initialItems.map(withKey));
  const [open, setOpen] = useState<string | null>(null);
  const { pending, message, run } = useSaver();

  function update(key: string, name: string, value: unknown) {
    setItems((list) => list.map((it) => (it._key === key ? { ...it, [name]: value } : it)));
  }

  function move(index: number, delta: number) {
    setItems((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });
  }

  function add() {
    const blank: Record<string, unknown> = {};
    for (const f of fields) {
      blank[f.name] =
        f.type === "tags" || f.type === "skills"
          ? []
          : f.type === "period"
            ? { start: "optional" in f && f.optional ? "" : currentMonth(), end: "" }
            : "";
    }
    const item = withKey(blank);
    setItems((list) => [item, ...list]);
    setOpen(item._key);
  }

  function save() {
    // The server keeps only schema fields, so the client-side _key is dropped.
    run(() => saveSection(section, items));
  }

  return (
    <div className="max-w-2xl space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={add} className={secondaryButton}>
          <Plus size={16} /> Add
        </button>
        <button type="button" onClick={save} disabled={pending} className={primaryButton}>
          <Save size={16} /> {pending ? "Saving…" : "Save changes"}
        </button>
        <SaveStatus message={message} />
      </div>

      {items.length === 0 && <p className="text-sm text-muted">No items yet.</p>}

      {items.map((item, index) => {
        const isOpen = open === item._key;
        const label = String(item[itemLabel] || "") || "Untitled";
        return (
          <div key={item._key} className="rounded-xl border border-line bg-card">
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item._key)}
                className="min-w-0 flex-1 truncate text-left font-medium hover:text-accent"
              >
                {label}
              </button>
              <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                <ChevronUp size={16} />
              </IconButton>
              <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                <ChevronDown size={16} />
              </IconButton>
              <IconButton
                label="Remove"
                onClick={() => {
                  if (confirm(`Remove “${label}”? This takes effect when you save.`)) {
                    setItems((list) => list.filter((it) => it._key !== item._key));
                  }
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </div>
            {isOpen && (
              <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <FieldInput
                    key={field.name}
                    field={field}
                    value={item[field.name]}
                    onChange={(v) => update(item._key, field.name, v)}
                    associationOptions={associationOptions}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md p-1.5 text-muted transition hover:bg-card-hover hover:text-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}
