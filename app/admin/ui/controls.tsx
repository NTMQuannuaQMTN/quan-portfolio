"use client";

import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import { skillsToText, textToSkills, type Field } from "@/lib/schemas";
import type { ActionResult } from "../actions";
import type { Period } from "@/lib/period";
import PeriodInput from "./PeriodInput";
import { uploadFile } from "./upload";

export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50";
export const primaryButton = `${buttonClass} bg-accent text-on-accent hover:bg-accent-hover`;
export const secondaryButton = `${buttonClass} border border-line bg-card hover:bg-card-hover`;

export function Label({ children, help }: { children: React.ReactNode; help?: string }) {
  return (
    <span className="mb-1 block">
      <span className="text-sm font-medium">{children}</span>
      {help && <span className="ml-2 text-xs text-muted">{help}</span>}
    </span>
  );
}

export function UploadButton({
  accept,
  onUploaded,
  label = "Upload",
}: {
  accept?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col">
      <label className={`${secondaryButton} cursor-pointer whitespace-nowrap ${busy ? "pointer-events-none opacity-50" : ""}`}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {busy ? "Uploading…" : label}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            setError(null);
            try {
              onUploaded(await uploadFile(file));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {error && <span className="mt-1 text-xs text-accent">{error}</span>}
    </span>
  );
}

/** Text input with an upload button and (for images) a preview. */
export function MediaInput({
  value,
  onChange,
  accept,
  preview,
  placeholder = "Paste a URL or upload",
}: {
  value: string;
  onChange: (value: string) => void;
  accept: string;
  preview?: "image" | "audio";
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
        <UploadButton accept={accept} onUploaded={onChange} />
      </div>
      {value && preview === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 max-w-full rounded-lg border border-line object-cover" />
      )}
      {value && preview === "audio" && <audio src={value} controls className="w-full" />}
    </div>
  );
}

export type SelectOption = { value: string; label: string; group?: string };

export function FieldInput({
  field,
  value,
  onChange,
  associationOptions = [],
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Choices for "association" fields (your experiences and schools). */
  associationOptions?: SelectOption[];
}) {
  const str = typeof value === "string" ? value : "";

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea value={str} onChange={(e) => onChange(e.target.value)} rows={4} placeholder={field.placeholder} className={inputClass} />
      );
      break;
    case "tags":
      control = (
        <TagsInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />
      );
      break;
    case "skills":
      control = (
        <SkillsInput value={Array.isArray(value) ? (value as { name: string; logo: string }[]) : []} onChange={onChange} />
      );
      break;
    case "period":
      control = (
        <PeriodInput
          value={value as Period | undefined}
          onChange={onChange}
          optional={field.optional}
          currentLabel={field.currentLabel}
        />
      );
      break;
    case "select":
      control = (
        <select value={str} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">Please select</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "association": {
      const groups = [...new Set(associationOptions.map((o) => o.group ?? ""))];
      control = (
        <select value={str} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">Please select</option>
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {associationOptions
                .filter((o) => (o.group ?? "") === group)
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      );
      break;
    }
    case "image":
      control = <MediaInput value={str} onChange={onChange} accept="image/*" preview="image" />;
      break;
    case "file":
      control = <MediaInput value={str} onChange={onChange} accept=".pdf,application/pdf" />;
      break;
    default:
      control = (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
  }

  // The date fields label themselves (Start date / End date).
  if (field.type === "period") return <div className={field.half ? "" : "sm:col-span-2"}>{control}</div>;

  // These inputs contain their own labels / multiple controls, and labels can't nest.
  const Wrapper = ["image", "file"].includes(field.type) ? "div" : "label";
  return (
    <Wrapper className={`block ${field.half ? "" : "sm:col-span-2"}`}>
      <Label help={field.help}>{field.label}</Label>
      {control}
    </Wrapper>
  );
}

/* Keep the raw text while typing so commas / newlines aren't eaten. */
function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState(value.join(", "));
  return (
    <input
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean));
      }}
      className={inputClass}
    />
  );
}

function SkillsInput({ value, onChange }: { value: { name: string; logo: string }[]; onChange: (v: unknown) => void }) {
  const [text, setText] = useState(skillsToText(value));
  return (
    <textarea
      value={text}
      rows={5}
      onChange={(e) => {
        setText(e.target.value);
        onChange(textToSkills(e.target.value));
      }}
      className={`${inputClass} font-mono`}
    />
  );
}

/** Runs a server action and tracks a status message. */
export function useSaver() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function run(action: () => Promise<ActionResult>, onOk?: (result: ActionResult) => void) {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setMessage({ ok: true, text: "Saved." });
        onOk?.(result);
      } else {
        setMessage({ ok: false, text: result.error });
      }
    });
  }

  return { pending, message, run };
}

export function SaveStatus({ message }: { message: { ok: boolean; text: string } | null }) {
  if (!message) return null;
  return (
    <span role="status" className={`text-sm ${message.ok ? "text-green-600 dark:text-green-400" : "text-accent"}`}>
      {message.text}
    </span>
  );
}
