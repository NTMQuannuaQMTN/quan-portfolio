import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getBlogs } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { primaryButton } from "../../ui/controls";
import PageTitle from "../../ui/PageTitle";

export default async function BlogsPage() {
  await requireAdmin();
  const posts = await getBlogs();

  return (
    <>
      <PageTitle title="Blogs" subtitle={`${posts.length} post${posts.length === 1 ? "" : "s"}`}>
        <Link href="/admin/blogs/new" className={primaryButton}>
          <Plus size={16} /> New post
        </Link>
      </PageTitle>

      {posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet. Write your first one!</p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-card">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/admin/blogs/${post.id}`} className="flex items-center gap-4 p-4 hover:bg-card-hover">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{post.title}</p>
                  <p className="text-xs text-muted">
                    {formatDate(post.createdAt)} · /blog/{post.slug}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.published ? "bg-accent-soft text-accent" : "bg-card-hover text-muted"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
