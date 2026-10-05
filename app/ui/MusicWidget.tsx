"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Music } from "lucide-react";
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

export default function MusicWidget({ entry }: { entry: MusicEntry }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const showButtonRef = useRef<HTMLButtonElement>(null);
  const hideButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  // Hidden = shrunk to the music icon. The player stays mounted, so music keeps playing.
  const [hidden, setHidden] = useState(false);
  const uri = spotifyUri(entry.spotifyUrl);

  useEffect(() => {
    const host = embedRef.current;
    if (!host || !uri) return;

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
  }, [uri]);

  if (!uri) return null;

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
          aria-label={`Show music player: ${entry.title}${entry.artist ? ` by ${entry.artist}` : ""}`}
          title="My music of the day"
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
            <Music size={12} /> My music of the day
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
        <div ref={embedRef} className="h-20 bg-card [&_iframe]:block" />
      </div>
    </div>
  );
}
