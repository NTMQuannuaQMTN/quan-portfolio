import { getMusic } from "@/lib/content";
import MusicWidget from "../ui/MusicWidget";

// Content is edited from /admin, so always render with fresh data.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [today] = await getMusic(1);

  return (
    <>
      {children}
      {today && <MusicWidget key={today.id} entry={today} />}
    </>
  );
}
