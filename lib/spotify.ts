const KINDS = ["track", "album", "playlist", "episode", "show", "artist"] as const;
export type SpotifyKind = (typeof KINDS)[number];

/**
 * Parse a Spotify share link or URI into its kind and id.
 * Accepts https://open.spotify.com/(intl-xx/)track/ID?si=… and spotify:track:ID.
 */
export function parseSpotify(input: string): { kind: SpotifyKind; id: string } | null {
  const value = input.trim();
  const uri = /^spotify:([a-z]+):([A-Za-z0-9]{10,40})$/.exec(value);
  if (uri && KINDS.includes(uri[1] as SpotifyKind)) return { kind: uri[1] as SpotifyKind, id: uri[2] };

  try {
    const url = new URL(value);
    if (url.hostname !== "open.spotify.com") return null;
    const parts = url.pathname.split("/").filter((p) => p && !p.startsWith("intl-"));
    const [kind, id] = parts;
    if (KINDS.includes(kind as SpotifyKind) && /^[A-Za-z0-9]{10,40}$/.test(id ?? "")) {
      return { kind: kind as SpotifyKind, id };
    }
  } catch {}
  return null;
}

/** Canonical https link without tracking params. */
export function canonicalSpotifyUrl(input: string) {
  const parsed = parseSpotify(input);
  return parsed ? `https://open.spotify.com/${parsed.kind}/${parsed.id}` : null;
}

export function spotifyUri(input: string) {
  const parsed = parseSpotify(input);
  return parsed ? `spotify:${parsed.kind}:${parsed.id}` : null;
}
