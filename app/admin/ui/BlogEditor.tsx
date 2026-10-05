"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Save, Trash2 } from "lucide-react";
import { slugify } from "@/lib/format";
import type { BlogPost } from "@/lib/types";
import { deleteBlog, saveBlog } from "../actions";
import { inputClass, Label, MediaInput, primaryButton, SaveStatus, secondaryButton, UploadButton, useSaver } from "./controls";

const empty: Partial<BlogPost> = { title: "", slug: "", excerpt: "", content: "", cover: "", published: false };

export default function BlogEditor({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<BlogPost>>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [view, setView] = useState<"write" | "preview">("write");
  const { pending, message, run } = useSaver();

  const set = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => setPost((p) => ({ ...p, [key]: value }));

  function save(published: boolean) {
    const next = { ...post, published };
    setPost(next);
    run(
      () => saveBlog(next),
      (result) => {
        if (!initial && result.ok && result.id) router.replace(`/admin/blogs/${result.id}`);
        else router.refresh();
      }
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-xl border border-line bg-card p-5">
        <label className="block">
          <Label>Title</Label>
          <input
            value={post.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            className={`${inputClass} text-lg font-semibold`}
          />
        </label>
        <label className="block">
          <Label help="Used in the post URL: /blog/your-slug">Slug</Label>
          <input
            value={post.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            className={inputClass}
          />
        </label>
        <label className="block">
          <Label help="Shown in the feed.">Excerpt</Label>
          <textarea value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={inputClass} />
        </label>
        <div>
          <Label>Cover image</Label>
          <MediaInput value={post.cover ?? ""} onChange={(v) => set("cover", v)} accept="image/*" preview="image" />
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-2">
          {(["write", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                view === v ? "bg-accent-soft text-accent" : "text-muted hover:bg-card-hover"
              }`}
            >
              {v}
            </button>
          ))}
          <span className="ml-auto">
            <UploadButton
              accept="image/*"
              label="Insert image"
              onUploaded={(url) => set("content", `${post.content ?? ""}\n\n![](${url})\n`)}
            />
          </span>
        </div>
        {view === "write" ? (
          <textarea
            value={post.content}
            onChange={(e) => set("content", e.target.value)}
            rows={22}
            placeholder="Write in Markdown…"
            className="block w-full resize-y bg-transparent p-4 font-mono text-sm outline-none"
          />
        ) : (
          <div className="prose-post min-h-[300px] p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || "_Nothing to preview._"}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={pending} onClick={() => save(true)} className={primaryButton}>
          <Save size={16} /> {post.published && initial?.published ? "Update" : "Publish"}
        </button>
        <button type="button" disabled={pending} onClick={() => save(false)} className={secondaryButton}>
          {initial?.published ? "Unpublish" : "Save draft"}
        </button>
        {initial?.published && (
          <Link href={`/blog/${initial.slug}`} target="_blank" className={secondaryButton}>
            <ExternalLink size={14} /> View
          </Link>
        )}
        <SaveStatus message={message} />
        {initial && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete “${initial.title}”? This can't be undone.`)) return;
              run(
                () => deleteBlog(initial.id),
                () => router.replace("/admin/blogs")
              );
            }}
            className={`${secondaryButton} ml-auto text-accent`}
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
