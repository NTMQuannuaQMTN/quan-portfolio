"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Music, Pencil, Save, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { parseSpotify } from "@/lib/spotify";
import type { MusicEntry } from "@/lib/types";
import { deleteMusicEntry, lookupSpotify, saveMusicEntry } from "../actions";
import { inputClass, Label, primaryButton, SaveStatus, secondaryButton, useSaver } from "./controls";

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const blank = (): Partial<MusicEntry> => ({
  date: localToday(),
  spotifyUrl: "",
  title: "",
  artist: "",
  coverUrl: "",
  note: "",
});

export default function MusicManager({ entries }: { entries: MusicEntry[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<MusicEntry>>(blank);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [looking, startLookup] = useTransition();
  const { pending, message, run } = useSaver();
  const editing = Boolean(form.id);

  const set = (key: keyof MusicEntry, value: string) => setForm((f) => ({ ...f, [key]: value }));

  function lookup(link: string) {
    setLookupError(null);
    if (!parseSpotify(link)) {
      if (link.trim()) setLookupError("Paste a link like https://open.spotify.com/track/…");
      return;
    }
    startLookup(async () => {
      const result = await lookupSpotify(link);
      if ("error" in result) return setLookupError(result.error);
      setForm((f) => ({
        ...f,
        spotifyUrl: result.url,
        // Don't overwrite what you've typed yourself.
        title: f.title || result.title,
        artist: f.artist || result.artist,
        coverUrl: result.coverUrl || f.coverUrl,
      }));
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(
            () => saveMusicEntry(form),
            () => {
              setForm(blank());
              router.refresh();
            }
          );
        }}
        className="space-y-4 rounded-xl border border-line bg-card p-5"
      >
        <h2 className="text-lg font-bold">{editing ? "Edit song" : "Set today's song"}</h2>

        <label className="block">
          <Label help="Spotify → Share → Copy song link">Spotify link</Label>
          <div className="relative">
            <input
              type="url"
              required
              value={form.spotifyUrl}
              placeholder="https://open.spotify.com/track/…"
              onChange={(e) => set("spotifyUrl", e.target.value)}
              onPaste={(e) => lookup(e.clipboardData.getData("text"))}
              onBlur={(e) => !form.title && lookup(e.target.value)}
              className={inputClass}
            />
            {looking && <Loader2 size={16} className="absolute right-3 top-2.5 animate-spin text-muted" />}
          </div>
          {lookupError && <span className="mt-1 block text-xs text-accent">{lookupError}</span>}
        </label>

        <div className="flex gap-4">
          {form.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverUrl} alt="" className="h-[104px] w-[104px] shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Music />
            </div>
          )}
          <div className="grid flex-1 gap-3">
            <label className="block">
              <Label>Song title</Label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputClass} />
            </label>
            <label className="block">
              <Label>Artist</Label>
              <input value={form.artist} onChange={(e) => set("artist", e.target.value)} className={inputClass} />
            </label>
          </div>
        </div>

        <label className="block">
          <Label>Date</Label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <Label help="Why this song today?">Note</Label>
          <textarea value={form.note} onChange={(e) => set("note", e.target.value)} rows={2} className={inputClass} />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending || looking} className={primaryButton}>
            <Save size={16} /> {pending ? "Saving…" : editing ? "Save changes" : "Set as music of the day"}
          </button>
          {editing && (
            <button type="button" onClick={() => setForm(blank())} className={secondaryButton}>
              Cancel
            </button>
          )}
          <SaveStatus message={message} />
        </div>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-bold">History</h2>
        {entries.length === 0 && <p className="text-sm text-muted">No songs yet.</p>}
        <ul className="space-y-2">
          {entries.map((entry, i) => (
            <li key={entry.id} className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
              {entry.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.coverUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Music size={18} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {entry.title}
                  {i === 0 && (
                    <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-on-accent">Live</span>
                  )}
                </p>
                <p className="truncate text-xs text-muted">
                  {entry.artist} · {formatDate(entry.date)}
                </p>
              </div>
              <a href={entry.spotifyUrl} target="_blank" rel="noreferrer" aria-label="Open in Spotify" className="rounded-md p-1.5 text-muted hover:bg-card-hover hover:text-fg">
                <ExternalLink size={15} />
              </a>
              <button type="button" aria-label="Edit" onClick={() => setForm(entry)} className="rounded-md p-1.5 text-muted hover:bg-card-hover hover:text-fg">
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label="Delete"
                onClick={() => {
                  if (!confirm(`Delete “${entry.title}”?`)) return;
                  run(
                    () => deleteMusicEntry(entry.id),
                    () => router.refresh()
                  );
                }}
                className="rounded-md p-1.5 text-muted hover:bg-card-hover hover:text-accent"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
