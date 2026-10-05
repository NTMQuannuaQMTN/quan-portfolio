import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getPublishedBlog, getSite } from "@/lib/content";
import { formatDate, readingMinutes } from "@/lib/format";
import ThemeToggle from "@/app/ui/ThemeToggle";

type Props = { params: Promise<{ slug: string }> };

/** First image in the post body: Markdown ![alt](url) or an <img src="…"> tag. */
function firstImage(markdown: string) {
  const match =
    /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/.exec(markdown) ??
    /<img[^>]+src=["']([^"']+)["']/i.exec(markdown);
  return match?.[1] ?? "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [post, site] = await Promise.all([getPublishedBlog((await params).slug), getSite()]);
  if (!post) return {};

  // Link preview image: the post's cover, else the first image in the post,
  // else your profile cover photo, else your profile picture.
  const wide = post.cover || firstImage(post.content) || site.profile.cover;
  const image = wide || site.profile.avatar;
  const images = image ? [{ url: image, alt: post.title }] : [];

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [site.profile.name],
      images,
    },
    twitter: {
      // A square profile picture looks better as a small card than a cropped large one.
      card: wide ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, site] = await Promise.all([getPublishedBlog(slug), getSite()]);
  if (!post) notFound();

  return (
    <div className="min-h-screen pb-28">
      <nav className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">
            <ArrowLeft size={16} /> All posts
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <article className="mx-auto mt-6 max-w-3xl px-4">
        <div className="overflow-hidden rounded-xl border border-line bg-card shadow-card">
          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" className="max-h-[440px] w-full object-cover" />
          )}
          <div className="p-5 sm:p-10">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.profile.avatar || "/images/profile-dark.png"}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="text-sm leading-tight">
                <p className="font-semibold">{site.profile.name}</p>
                <p className="text-muted">
                  {formatDate(post.publishedAt ?? post.createdAt)} · {readingMinutes(post.content)} min read
                </p>
              </div>
            </div>
            <hr className="my-6 border-line" />
            <div className="prose-post">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
