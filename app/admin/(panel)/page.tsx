import Link from "next/link";
import { FileText, Music, PenSquare } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getBlogs, getMusic, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import PageTitle from "../ui/PageTitle";

export default async function AdminHome() {
  await requireAdmin();
  const [site, posts, music] = await Promise.all([getSite(), getBlogs(), getMusic()]);
  const [today] = music;
  const published = posts.filter((p) => p.published).length;

  const stats = [
    { label: "Published posts", value: published },
    { label: "Drafts", value: posts.length - published },
    { label: "Projects", value: site.projects.length },
    { label: "Experiences", value: site.experiences.length },
  ];

  return (
    <>
      <PageTitle title={`Hi, ${site.profile.name.split(" ").at(-1)}`} subtitle="What would you like to update today?" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/music" className="group rounded-xl border border-line bg-card p-5 transition hover:border-accent">
          <Music className="text-accent" />
          <p className="mt-3 font-semibold group-hover:text-accent">Set music of the day</p>
          <p className="mt-1 text-sm text-muted">
            {today ? `Now: ${today.title} — ${today.artist} (${formatDate(today.date)})` : "No song set yet."}
          </p>
        </Link>
        <Link href="/admin/blogs/new" className="group rounded-xl border border-line bg-card p-5 transition hover:border-accent">
          <PenSquare className="text-accent" />
          <p className="mt-3 font-semibold group-hover:text-accent">Write a new post</p>
          <p className="mt-1 text-sm text-muted">Markdown editor with live preview.</p>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-card p-4">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Recent posts</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-card">
            {posts.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link href={`/admin/blogs/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-card-hover">
                  <FileText size={16} className="text-muted" />
                  <span className="min-w-0 flex-1 truncate">{p.title}</span>
                  {!p.published && <span className="text-xs text-muted">Draft</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
