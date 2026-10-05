import { isAdmin } from "@/lib/auth";
import { createSignedUpload, supabaseWritable, UPLOAD_FOLDERS, type UploadFolder } from "@/lib/supabase";

/**
 * POST `{ name, folder? }` → `{ uploadUrl, publicUrl }`. The browser then PUTs the file
 * straight to Supabase Storage, so large files never pass through this server.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseWritable) {
    return Response.json({ error: "Uploads need SUPABASE_SECRET_KEY in your .env." }, { status: 503 });
  }

  try {
    const { name, folder = "uploads" } = (await request.json()) as { name?: string; folder?: string };
    if (!name) return Response.json({ error: "Missing file name" }, { status: 400 });
    if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
      return Response.json({ error: "Invalid folder" }, { status: 400 });
    }
    return Response.json(await createSignedUpload(name, folder as UploadFolder));
  } catch (err) {
    console.error(err);
    const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
