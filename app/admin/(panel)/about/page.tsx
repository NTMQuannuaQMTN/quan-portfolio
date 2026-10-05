import { requireAdmin } from "@/lib/auth";
import { getSite } from "@/lib/content";
import ListEditor from "../../ui/ListEditor";
import PageTitle from "../../ui/PageTitle";

export default async function AboutPage() {
  await requireAdmin();
  const site = await getSite();
  return (
    <>
      <PageTitle title="About" subtitle="The “About me” text lives under Profile. Skills and Journey are edited here." />
      <h2 className="mb-3 text-lg font-semibold">Skills</h2>
      <ListEditor section="skills" initialItems={site.skills} />
      <h2 className="mb-3 mt-10 text-lg font-semibold">Journey</h2>
      <ListEditor section="journey" initialItems={site.journey} />
    </>
  );
}
