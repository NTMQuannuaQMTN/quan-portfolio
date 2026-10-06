import { getMusic, getRecentMusic } from "@/lib/content";
import MusicWidget from "../ui/MusicWidget";

// Content is edited from /admin, so always render with fresh data.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // A day of slack beyond a month, so visitors ahead of UTC still get a full "Past month".
  const recent = await getRecentMusic(31);
  const songs = recent.length > 0 ? recent : await getMusic(1);

  return (
    <>
      {children}
      {songs.length > 0 && <MusicWidget songs={songs} serverToday={new Date().toISOString().slice(0, 10)} />}
    </>
  );
}
