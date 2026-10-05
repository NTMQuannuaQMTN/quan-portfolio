import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getBlog } from "@/lib/content";
import BlogEditor from "../../../ui/BlogEditor";
import PageTitle from "../../../ui/PageTitle";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const post = isUuid ? await getBlog(id) : null;
  if (!post) notFound();

  return (
    <>
      <PageTitle title="Edit post" />
      <BlogEditor key={post.updatedAt} initial={post} />
    </>
  );
}
