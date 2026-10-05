import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients. Never import this from a client component.
 *
 * - Reads use the secret key when present, otherwise the publishable key
 *   (which can only see what RLS allows: public content, published posts).
 * - Writes and uploads need the secret key (it bypasses RLS).
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
export const MEDIA_BUCKET = process.env.SUPABASE_BUCKET || "media";

/** Content can be read from Supabase. */
export const supabaseConfigured = Boolean(url && (secretKey || publishableKey));
/** Content can be saved to Supabase (admin edits, uploads). */
export const supabaseWritable = Boolean(url && secretKey);

const options = { auth: { persistSession: false, autoRefreshToken: false } };
let readClient: SupabaseClient | null = null;
let writeClient: SupabaseClient | null = null;

/** Client for reading content. */
export function dbRead(): SupabaseClient {
  if (!url || !(secretKey || publishableKey)) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.");
  }
  readClient ??= createClient(url, (secretKey || publishableKey)!, options);
  return readClient;
}

/** Client for admin writes and uploads. */
export function db(): SupabaseClient {
  if (!url || !secretKey) {
    throw new Error("Saving needs SUPABASE_SECRET_KEY in your .env (Supabase → Project Settings → API Keys).");
  }
  writeClient ??= createClient(url, secretKey, options);
  return writeClient;
}

function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).toLowerCase().replace(/[^.a-z0-9]/g, "") : "";
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${Date.now()}-${base || "file"}${ext}`;
}

export const UPLOAD_FOLDERS = ["uploads", "avatars", "covers"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/**
 * Create a signed upload URL so the browser sends the file straight to
 * Supabase Storage (avoids serverless request size limits).
 */
export async function createSignedUpload(fileName: string, folder: UploadFolder = "uploads") {
  const path = `${folder}/${safeFileName(fileName)}`;
  const bucket = db().storage.from(MEDIA_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error) throw error;
  return {
    uploadUrl: data.signedUrl,
    publicUrl: bucket.getPublicUrl(path).data.publicUrl,
  };
}
