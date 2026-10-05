/** Upload a file from the browser to Supabase Storage and return its public URL. */
export async function uploadFile(file: File, folder: "uploads" | "avatars" | "covers" = "uploads"): Promise<string> {
  const init = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, folder }),
  });
  const plan = await init.json();
  if (!init.ok) throw new Error(plan.error ?? "Upload failed");

  const res = await fetch(plan.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return plan.publicUrl as string;
}
