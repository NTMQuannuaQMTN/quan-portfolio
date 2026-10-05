import { requireAdmin } from "@/lib/auth";
import { getMusic } from "@/lib/content";
import MusicManager from "../../ui/MusicManager";
import PageTitle from "../../ui/PageTitle";

export default async function MusicPage() {
  await requireAdmin();
  const entries = await getMusic();
  return (
    <>
      <PageTitle
        title="Music of the day"
        subtitle="The newest song shows in the Music card and plays in the corner widget (Spotify)."
      />
      <MusicManager entries={entries} />
    </>
  );
}
