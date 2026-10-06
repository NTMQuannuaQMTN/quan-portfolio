"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, ListMusic, Music, SkipBack, SkipForward } from "lucide-react";
import { formatDate } from "@/lib/format";
import { spotifyUri } from "@/lib/spotify";
import type { MusicEntry } from "@/lib/types";

/* ---------- Spotify iFrame API (https://developer.spotify.com/documentation/embeds) ---------- */

type PlaybackEvent = { data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number } };
type EmbedController = {
  loadUri(uri: string): void;
  play(): void;
  resume(): void;
  pause(): void;
  togglePlay(): void;
  destroy(): void;
  addListener(event: "ready", cb: () => void): void;
  addListener(event: "playback_update", cb: (e: PlaybackEvent) => void): void;
};
type IFrameAPI = {
  createController(
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: EmbedController) => void
  ): void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

let apiPromise: Promise<IFrameAPI> | null = null;
function loadSpotifyApi() {
  apiPromise ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return apiPromise;
}

/* ---------- Playlist range (the visitor's choice, remembered in this browser) ---------- */

type Range = "week" | "month";
const RANGES: { id: Range; label: string; days: number }[] = [
  { id: "week", label: "Past week", days: 7 },
  { id: "month", label: "Past month", days: 30 },
];
const RANGE_KEY = "music-playlist-range";
const rangeListeners = new Set<() => void>();

function readRange(): Range {
  try {
    return localStorage.getItem(RANGE_KEY) === "month" ? "month" : "week";
  } catch {
    return "week";
  }
}
function writeRange(range: Range) {
  try {
    localStorage.setItem(RANGE_KEY, range);
  } catch {}
  rangeListeners.forEach((l) => l());
}
function subscribeRange(listener: () => void) {
  rangeListeners.add(listener);
  return () => {
    rangeListeners.delete(listener);
  };
}

const noopSubscribe = () => () => {};
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysBefore(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/* ---------- Widget ---------- */

type Status = "loading" | "playing" | "paused" | "blocked";

/** Spotify sends no "ended" event, so move on when a track is this close to its end. */
const END_MARGIN_MS = 1500;

export default function MusicWidget({ songs, serverToday }: { songs: MusicEntry[]; serverToday: string }) {
  const range = useSyncExternalStore(subscribeRange, readRange, () => "week" as Range);
  // The visitor's own date (the server's while hydrating, so the markup matches).
  const today = useSyncExternalStore(noopSubscribe, localToday, () => serverToday);

  const playable = songs.filter((s) => spotifyUri(s.spotifyUrl));
  const days = RANGES.find((r) => r.id === range)!.days;
  const cutoff = daysBefore(today, days - 1);
  const inRange = playable.filter((s) => s.date >= cutoff && s.date <= today);
  // Nothing in this range: fall back to the latest song so there's always music.
  const playlist = inRange.length > 0 ? inRange : playable.slice(0, 1);
  const usingFallback = inRange.length === 0;

  const [currentId, setCurrentId] = useState<string | null>(null);
  const currentIndex = Math.max(0, playlist.findIndex((s) => s.id === currentId));
  const current = playlist[currentIndex];
  const currentUri = current ? spotifyUri(current.spotifyUrl) : null;

  const [status, setStatus] = useState<Status>("loading");
  // Hidden = shrunk to the music icon. The player stays mounted, so music keeps playing.
  const [hidden, setHidden] = useState(false);
  const [showList, setShowList] = useState(false);

  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const loadedUriRef = useRef<string | null>(null);
  const playOnReadyRef = useRef(false);
  const endTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showButtonRef = useRef<HTMLButtonElement>(null);
  const hideButtonRef = useRef<HTMLButtonElement>(null);
  // "Play the next song", kept current for the Spotify listeners (registered once).
  const nextRef = useRef<() => void>(() => {});
  // The song to start with once Spotify's script has loaded (the range may change before then).
  const currentUriRef = useRef(currentUri);

  function goTo(index: number) {
    const song = playlist[(index + playlist.length) % playlist.length];
    if (!song) return;
    clearTimeout(endTimerRef.current);
    endTimerRef.current = undefined;
    if (song.id === current?.id) {
      // Same song again (e.g. a one-song playlist looping): restart it.
      controllerRef.current?.play();
      return;
    }
    playOnReadyRef.current = true;
    setCurrentId(song.id);
  }

  useEffect(() => {
    nextRef.current = () => goTo(currentIndex + 1);
    currentUriRef.current = currentUri;
  });

  function changeRange(next: Range) {
    if (next === range) return;
    // Keep the music going: if it's playing, play the new playlist's song once it loads.
    if (status === "playing") playOnReadyRef.current = true;
    writeRange(next);
  }

  // Create the Spotify player once; later songs are loaded into it with loadUri.
  useEffect(() => {
    const host = embedRef.current;
    if (!host) return;

    let cancelled = false;
    let started = false;
    const events = ["pointerdown", "keydown"] as const;
    const startOnInteraction = () => {
      removeListeners();
      controllerRef.current?.resume();
    };
    function removeListeners() {
      events.forEach((e) => document.removeEventListener(e, startOnInteraction, true));
    }

    // createController replaces the element it's given, so give it a child.
    const target = document.createElement("div");
    host.appendChild(target);

    loadSpotifyApi().then((api) => {
      const uri = currentUriRef.current;
      if (cancelled || !uri) return;
      api.createController(target, { uri, width: "100%", height: 80 }, (controller) => {
        if (cancelled) return controller.destroy();
        controllerRef.current = controller;
        loadedUriRef.current = uri;
        // The selection changed while the player was being created.
        if (currentUriRef.current && currentUriRef.current !== uri) {
          loadedUriRef.current = currentUriRef.current;
          controller.loadUri(currentUriRef.current);
        }
        let firstReady = true;

        controller.addListener("ready", () => {
          if (firstReady) {
            firstReady = false;
            controller.play();
            // If the browser blocked autoplay, start on the first interaction instead.
            setTimeout(() => {
              if (cancelled || started) return;
              setStatus("blocked");
              events.forEach((e) => document.addEventListener(e, startOnInteraction, true));
            }, 2500);
          } else if (playOnReadyRef.current) {
            // A song picked from the playlist has loaded.
            playOnReadyRef.current = false;
            controller.play();
          }
        });

        controller.addListener("playback_update", (e) => {
          const { isPaused, position, duration } = e.data;
          const playing = !isPaused && position > 0;
          if (playing) {
            started = true;
            removeListeners();
          }
          setStatus((s) => (playing ? "playing" : s === "blocked" ? s : "paused"));

          if (!isPaused && duration > 0 && position >= duration - END_MARGIN_MS) {
            // Near the end: queue the next song.
            endTimerRef.current ??= setTimeout(() => {
              endTimerRef.current = undefined;
              nextRef.current();
            }, Math.max(0, duration - position) + 300);
          } else if (endTimerRef.current && position < duration - END_MARGIN_MS) {
            // Seeked back: cancel the queued skip.
            clearTimeout(endTimerRef.current);
            endTimerRef.current = undefined;
          }
        });
      });
    });

    return () => {
      cancelled = true;
      removeListeners();
      clearTimeout(endTimerRef.current);
      endTimerRef.current = undefined;
      controllerRef.current?.destroy();
      controllerRef.current = null;
      loadedUriRef.current = null;
      host.replaceChildren();
    };
    // Created once on mount; switching songs goes through loadUri below.
  }, []);

  // Load the selected song into the existing player.
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !currentUri || loadedUriRef.current === currentUri) return;
    loadedUriRef.current = currentUri;
    controller.loadUri(currentUri); // fires "ready", which plays it
  }, [currentUri]);

  if (!current || !currentUri) return null;

  function hide() {
    setHidden(true);
    // Keep keyboard focus on the widget: move it to the icon that brings it back.
    requestAnimationFrame(() => showButtonRef.current?.focus());
  }

  function show() {
    setHidden(false);
    requestAnimationFrame(() => hideButtonRef.current?.focus());
  }

  const playing = status === "playing";

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      {hidden && (
        <button
          ref={showButtonRef}
          type="button"
          onClick={show}
          aria-label={`Show music player: ${current.title}${current.artist ? ` by ${current.artist}` : ""}`}
          title="My music"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg transition hover:scale-105 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          <Music size={22} />
          {playing && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-end justify-center gap-[2px] rounded-full border-2 border-card bg-fg px-1 pb-1"
              aria-hidden="true"
            >
              {[0, 0.25, 0.5].map((delay) => (
                <span key={delay} className="eq-bar h-2.5 w-[2px] rounded-sm bg-card" style={{ animationDelay: `${delay}s` }} />
              ))}
            </span>
          )}
        </button>
      )}

      {/* Stays mounted while hidden so the music keeps playing. */}
      <div
        className={
          hidden
            ? "pointer-events-none fixed -left-[9999px] top-0 w-80 opacity-0"
            : "w-[340px] max-w-full overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
        }
        inert={hidden}
      >
        <div className="flex items-center justify-between bg-accent px-3 py-1.5 text-on-accent">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <Music size={12} /> My music
            {status === "blocked" && (
              <span className="ml-1 font-medium normal-case tracking-normal opacity-90">· tap anywhere to play</span>
            )}
          </span>
          <button
            ref={hideButtonRef}
            type="button"
            onClick={hide}
            aria-label="Hide music player"
            title="Hide"
            className="rounded p-1 hover:bg-white/20"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Playlist: range, previous / next, song list */}
        <div className="flex items-center gap-2 border-b border-line px-2 py-1.5">
          <div role="radiogroup" aria-label="Playlist" className="flex rounded-full bg-card-hover p-0.5 text-xs font-semibold">
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={range === r.id}
                onClick={() => changeRange(r.id)}
                className={`rounded-full px-2.5 py-1 transition ${
                  range === r.id ? "bg-accent text-on-accent shadow" : "text-muted hover:text-fg"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center">
            <IconButton label="Previous song" onClick={() => goTo(currentIndex - 1)} disabled={playlist.length < 2}>
              <SkipBack size={15} />
            </IconButton>
            <span className="min-w-[2.75rem] text-center text-xs tabular-nums text-muted" aria-live="polite">
              {currentIndex + 1} / {playlist.length}
            </span>
            <IconButton label="Next song" onClick={() => goTo(currentIndex + 1)} disabled={playlist.length < 2}>
              <SkipForward size={15} />
            </IconButton>
            <IconButton label={showList ? "Hide song list" : "Show song list"} onClick={() => setShowList((v) => !v)} pressed={showList}>
              <ListMusic size={15} />
            </IconButton>
          </div>
        </div>

        {usingFallback && (
          <p className="border-b border-line px-3 py-1.5 text-xs text-muted">
            No songs in the {range === "week" ? "past week" : "past month"} — playing my latest.
          </p>
        )}

        <div ref={embedRef} className="h-20 bg-card [&_iframe]:block" />

        {showList && (
          <ol className="max-h-56 overflow-y-auto border-t border-line py-1" aria-label="Songs">
            {playlist.map((song, i) => {
              const active = i === currentIndex;
              return (
                <li key={song.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active || undefined}
                    className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition hover:bg-card-hover ${
                      active ? "bg-accent-soft" : ""
                    }`}
                  >
                    {song.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={song.coverUrl} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent-soft text-accent">
                        <Music size={14} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${active ? "font-semibold text-accent" : "font-medium"}`}>
                        {song.title}
                      </span>
                      <span className="block truncate text-xs text-muted">{song.artist}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-muted">
                      {formatDate(song.date, { month: "short", year: undefined })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md p-1.5 transition hover:bg-card-hover hover:text-fg disabled:opacity-30 ${
        pressed ? "text-accent" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}
