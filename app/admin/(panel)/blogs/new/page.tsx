import { requireAdmin } from "@/lib/auth";
import BlogEditor from "../../../ui/BlogEditor";
import PageTitle from "../../../ui/PageTitle";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="New post" />
      <BlogEditor />
    </>
  );
}
