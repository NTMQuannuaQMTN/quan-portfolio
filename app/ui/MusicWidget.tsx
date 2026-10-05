"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Music, X } from "lucide-react";
import { spotifyUri } from "@/lib/spotify";
import type { MusicEntry } from "@/lib/types";

/* ---------- Spotify iFrame API (https://developer.spotify.com/documentation/embeds) ---------- */

type PlaybackEvent = { data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number } };
type EmbedController = {
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

/* ---------- Widget ---------- */

type Status = "loading" | "playing" | "paused" | "blocked";

const DISMISS_KEY = "music-widget-dismissed";
const noopSubscribe = () => () => {};

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
}

export default function MusicWidget({ entry }: { entry: MusicEntry }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [collapsed, setCollapsed] = useState(false);
  const [closedNow, setClosedNow] = useState(false);
  // Read localStorage only on the client so server and client markup match.
  const storedDismissal = useSyncExternalStore(noopSubscribe, readDismissed, () => null);
  const dismissed = closedNow || storedDismissal === entry.id;
  const uri = spotifyUri(entry.spotifyUrl);

  useEffect(() => {
    const host = embedRef.current;
    if (!host || !uri || readDismissed() === entry.id) return;

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
      if (cancelled) return;
      api.createController(target, { uri, width: "100%", height: 80 }, (controller) => {
        if (cancelled) return controller.destroy();
        controllerRef.current = controller;

        controller.addListener("ready", () => {
          controller.play();
          // If the browser blocked autoplay, start on the first interaction instead.
          setTimeout(() => {
            if (cancelled || started) return;
            setStatus("blocked");
            events.forEach((e) => document.addEventListener(e, startOnInteraction, true));
          }, 2500);
        });

        controller.addListener("playback_update", (e) => {
          const playing = !e.data.isPaused && e.data.position > 0;
          if (playing) {
            started = true;
            removeListeners();
          }
          setStatus((s) => (playing ? "playing" : s === "blocked" ? s : "paused"));
        });
      });
    });

    return () => {
      cancelled = true;
      removeListeners();
      controllerRef.current?.destroy();
      controllerRef.current = null;
      host.replaceChildren();
    };
  }, [uri, entry.id]);

  if (dismissed || !uri) return null;

  function dismiss() {
    controllerRef.current?.pause();
    try {
      localStorage.setItem(DISMISS_KEY, entry.id);
    } catch {}
    setClosedNow(true);
  }

  const playing = status === "playing";

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label={`Music of the day: ${entry.title}. Expand player`}
          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-line bg-card shadow-lg ring-2 ring-accent"
        >
          {entry.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.coverUrl}
              alt=""
              className={`h-full w-full object-cover ${playing ? "animate-[spin_8s_linear_infinite]" : ""}`}
            />
          ) : (
            <Music size={20} className="text-accent" />
          )}
        </button>
      )}

      {/* Stays mounted while collapsed so the music keeps playing. */}
      <div
        className={
          collapsed
            ? "pointer-events-none fixed -left-[9999px] top-0 w-80 opacity-0"
            : "w-[340px] max-w-full overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
        }
        aria-hidden={collapsed || undefined}
      >
        <div className="flex items-center justify-between bg-accent px-3 py-1.5 text-on-accent">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <Music size={12} /> My music of the day
            {status === "blocked" && (
              <span className="ml-1 font-medium normal-case tracking-normal opacity-90">· tap anywhere to play</span>
            )}
          </span>
          <span className="flex items-center">
            <button type="button" onClick={() => setCollapsed(true)} aria-label="Minimize player" className="rounded p-1 hover:bg-white/20">
              <ChevronDown size={14} />
            </button>
            <button type="button" onClick={dismiss} aria-label="Close player" className="rounded p-1 hover:bg-white/20">
              <X size={14} />
            </button>
          </span>
        </div>
        <div ref={embedRef} className="h-20 bg-card [&_iframe]:block" />
      </div>
    </div>
  );
}
