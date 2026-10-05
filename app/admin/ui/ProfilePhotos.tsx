"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { saveProfilePhotos } from "../actions";
import { uploadFile } from "./upload";

const MAX_BYTES = 10 * 1024 * 1024;

type Kind = "avatar" | "cover";

/* eslint-disable @next/next/no-img-element */

export default function ProfilePhotos({
  avatar,
  cover,
  writable,
}: {
  avatar: string;
  cover: string;
  writable: boolean;
}) {
  const router = useRouter();
  const [urls, setUrls] = useState({ avatar, cover });
  const [busy, setBusy] = useState<Kind | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const previews = useRef<string[]>([]);

  // Release local preview URLs when leaving the page.
  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  async function change(kind: Kind, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage({ ok: false, text: "Please choose an image file." });
    if (file.size > MAX_BYTES) return setMessage({ ok: false, text: "Images must be 10 MB or smaller." });

    const previous = urls[kind];
    const preview = URL.createObjectURL(file);
    previews.current.push(preview);
    setUrls((u) => ({ ...u, [kind]: preview }));
    setBusy(kind);
    setMessage(null);

    try {
      const url = await uploadFile(file, kind === "avatar" ? "avatars" : "covers");
      const result = await saveProfilePhotos({ [kind]: url });
      if (!result.ok) throw new Error(result.error);
      setUrls((u) => ({ ...u, [kind]: url }));
      setMessage({ ok: true, text: kind === "avatar" ? "Profile picture updated." : "Cover photo updated." });
      router.refresh();
    } catch (err) {
      setUrls((u) => ({ ...u, [kind]: previous }));
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setBusy(null);
    }
  }

  async function remove(kind: Kind) {
    if (!confirm(kind === "avatar" ? "Remove your profile picture?" : "Remove your cover photo?")) return;
    setBusy(kind);
    setMessage(null);
    const result = await saveProfilePhotos({ [kind]: "" });
    setBusy(null);
    if (!result.ok) return setMessage({ ok: false, text: result.error });
    setUrls((u) => ({ ...u, [kind]: "" }));
    setMessage({ ok: true, text: "Removed." });
    router.refresh();
  }

  const disabled = !writable || busy !== null;

  return (
    <section className="mb-6 max-w-2xl overflow-hidden rounded-xl border border-line bg-card">
      {/* Cover */}
      <div className="relative h-44 w-full bg-gradient-to-br from-accent via-[#5c000d] to-black sm:h-56">
        {urls.cover && <img src={urls.cover} alt="Cover photo" className="h-full w-full object-cover" />}
        {busy === "cover" && <Uploading />}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {urls.cover && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => remove("cover")}
              aria-label="Remove cover photo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          )}
          <PickButton
            disabled={disabled}
            onPick={(f) => change("cover", f)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-black shadow transition hover:bg-zinc-100"
          >
            <ImagePlus size={16} /> {urls.cover ? "Change cover photo" : "Add cover photo"}
          </PickButton>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-wrap items-end gap-4 px-5 pb-5">
        <div className="relative -mt-14 shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-card bg-card-hover">
            <img
              src={urls.avatar || "/images/profile-dark.png"}
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
            {busy === "avatar" && <Uploading />}
          </div>
          <PickButton
            disabled={disabled}
            onPick={(f) => change("avatar", f)}
            ariaLabel="Change profile picture"
            className="absolute bottom-1 right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-card-hover text-fg shadow transition hover:text-accent"
          >
            <Camera size={16} />
          </PickButton>
        </div>

        <div className="min-w-0 flex-1 pb-1">
          <p className="font-semibold">Profile picture &amp; cover photo</p>
          <p className="text-sm text-muted">
            JPG, PNG or WebP up to 10 MB. Square works best for the profile picture; around 1600×600 for the cover.
          </p>
          {!writable && (
            <p className="mt-1 text-sm text-accent">Add SUPABASE_SECRET_KEY to your .env to enable uploads.</p>
          )}
          {message && (
            <p role="status" className={`mt-1 text-sm ${message.ok ? "text-green-600 dark:text-green-400" : "text-accent"}`}>
              {message.text}
            </p>
          )}
        </div>

        {urls.avatar && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => remove("avatar")}
            className="text-sm font-medium text-muted hover:text-accent disabled:opacity-50"
          >
            Remove profile picture
          </button>
        )}
      </div>
    </section>
  );
}

function PickButton({
  onPick,
  disabled,
  className,
  ariaLabel,
  children,
}: {
  onPick: (file: File | undefined) => void;
  disabled: boolean;
  className: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`${className} ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
    >
      {children}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function Uploading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
      <Loader2 className="animate-spin" />
    </div>
  );
}
