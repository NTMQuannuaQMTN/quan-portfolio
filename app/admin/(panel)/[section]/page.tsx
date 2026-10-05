import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSite } from "@/lib/content";
import { listSections } from "@/lib/schemas";
import ListEditor from "../../ui/ListEditor";
import PageTitle from "../../ui/PageTitle";

const SECTIONS = ["education", "projects", "experiences"] as const;

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section: param } = await params;
  const section = SECTIONS.find((s) => s === param);
  if (!section) notFound();

  const site = await getSite();
  // Projects can be "Associated with" a saved experience or school, like on LinkedIn.
  const associationOptions =
    section === "projects"
      ? [
          ...site.experiences
            .filter((e) => e.id)
            .map((e) => ({ value: `experience:${e.id}`, label: `${e.role} at ${e.company}`, group: "Experience" })),
          ...site.education
            .filter((e) => e.id)
            .map((e) => ({ value: `education:${e.id}`, label: e.school, group: "Education" })),
        ]
      : undefined;

  return (
    <>
      <PageTitle title={listSections[section].title} subtitle="Order here is the order on your site. Click an item to edit it." />
      <ListEditor key={section} section={section} initialItems={site[section]} associationOptions={associationOptions} />
    </>
  );
}
