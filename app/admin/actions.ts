"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import * as content from "@/lib/content";
import { canonicalSpotifyUrl } from "@/lib/spotify";
import { slugify } from "@/lib/format";
import { coerce, isListSection, listSections, profileFields } from "@/lib/schemas";
import type { BlogPost, MusicEntry, Profile } from "@/lib/types";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function fail(err: unknown): ActionResult {
  console.error(err);
  // Supabase errors are plain objects with a message, not Error instances.
  const message = err && typeof err === "object" && "message" in err ? String(err.message) : "";
  return { ok: false, error: message || "Something went wrong." };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validId = (id: unknown) => (typeof id === "string" && UUID.test(id) ? id : undefined);

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ---------- Auth ---------- */

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD) return "ADMIN_PASSWORD is not set on the server.";
  if (!checkPassword(password)) return "Wrong password.";
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Profile & sections ---------- */

export async function saveProfile(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  try {
    await content.saveProfile(coerce(profileFields, input) as Profile);
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/** Set (or clear, with "") the profile picture and/or cover photo. */
export async function saveProfilePhotos(input: { avatar?: string; cover?: string }): Promise<ActionResult> {
  await requireAdmin();
  const photos: Partial<Profile> = {};
  for (const key of ["avatar", "cover"] as const) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || (value && !/^(https:\/\/|\/)[^\s"'<>]*$/.test(value))) {
      return { ok: false, error: "Invalid image URL." };
    }
    photos[key] = value;
  }
  try {
    await content.saveProfile(photos);
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function saveSection(section: string, items: unknown): Promise<ActionResult> {
  await requireAdmin();
  if (!isListSection(section) || !Array.isArray(items)) {
    return { ok: false, error: "Invalid section." };
  }
  try {
    const { fields } = listSections[section];
    await content.saveSection(
      section,
      items.map((item) => ({ ...coerce(fields, item), id: validId(item?.id) }))
    );
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ---------- Blogs ---------- */

export async function saveBlog(input: Partial<BlogPost>): Promise<ActionResult> {
  await requireAdmin();
  try {
    const title = String(input.title ?? "").trim();
    if (!title) return { ok: false, error: "Title is required." };

    const id = validId(input.id) ?? randomUUID();
    let slug = slugify(String(input.slug ?? "") || title) || id.slice(0, 8);
    if (await content.slugTaken(slug, id)) slug = `${slug}-${id.slice(0, 4)}`;

    await content.upsertBlog({
      id,
      slug,
      title,
      excerpt: String(input.excerpt ?? "").trim(),
      content: String(input.content ?? ""),
      cover: String(input.cover ?? "").trim(),
      published: Boolean(input.published),
    });
    refreshSite();
    return { ok: true, id };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireAdmin();
  const valid = validId(id);
  if (!valid) return { ok: false, error: "Invalid post." };
  try {
    await content.deleteBlog(valid);
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ---------- Music of the day ---------- */

export type SpotifyLookup = { title: string; artist: string; coverUrl: string; url: string };

/** Fill in title / artist / cover from a Spotify link. */
export async function lookupSpotify(link: string): Promise<SpotifyLookup | { error: string }> {
  await requireAdmin();
  const url = canonicalSpotifyUrl(link);
  if (!url) return { error: "That doesn't look like a Spotify link." };

  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
      cache: "no-store",
    });
    if (!res.ok) return { error: "Spotify couldn't find that link." };
    const oembed = (await res.json()) as { title?: string; thumbnail_url?: string };

    // The artist isn't in oEmbed; read it from the page's meta tags (best effort).
    let artist = "";
    try {
      const page = await fetch(url, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0" } });
      const html = await page.text();
      const match =
        /<meta name="music:musician_description" content="([^"]*)"/.exec(html) ??
        /<meta property="og:description" content="([^"·]*)·/.exec(html);
      artist = decodeEntities(match?.[1]?.trim() ?? "");
    } catch {}

    return { url, title: oembed.title ?? "", artist, coverUrl: oembed.thumbnail_url ?? "" };
  } catch (err) {
    console.error(err);
    return { error: "Couldn't reach Spotify." };
  }
}

function decodeEntities(text: string) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export async function saveMusicEntry(input: Partial<MusicEntry>): Promise<ActionResult> {
  await requireAdmin();
  try {
    const spotifyUrl = canonicalSpotifyUrl(String(input.spotifyUrl ?? ""));
    if (!spotifyUrl) return { ok: false, error: "Paste a Spotify link (open.spotify.com/…)." };
    const title = String(input.title ?? "").trim();
    if (!title) return { ok: false, error: "Song title is required." };
    const date = String(input.date ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Pick a date." };

    await content.upsertMusic({
      id: validId(input.id),
      date,
      spotifyUrl,
      title,
      artist: String(input.artist ?? "").trim(),
      coverUrl: String(input.coverUrl ?? "").trim(),
      note: String(input.note ?? "").trim(),
    });
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteMusicEntry(id: string): Promise<ActionResult> {
  await requireAdmin();
  const valid = validId(id);
  if (!valid) return { ok: false, error: "Invalid entry." };
  try {
    await content.deleteMusic(valid);
    refreshSite();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}
