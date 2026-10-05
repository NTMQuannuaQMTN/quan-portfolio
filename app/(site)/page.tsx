import { getMusic, getPublishedBlogs, getSite } from "@/lib/content";
import ProfileHeader, { TABS, type TabId } from "../ui/ProfileHeader";
import { IntroCard, MusicCard } from "../ui/Sidebar";
import {
  AboutPanel,
  BlogsPanel,
  EducationPanel,
  ExperiencesPanel,
  ProjectsPanel,
} from "../ui/TabPanels";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: TabId = TABS.find((t) => t.id === rawTab)?.id ?? "blogs";

  const [site, posts, music] = await Promise.all([getSite(), getPublishedBlogs(), getMusic(6)]);

  return (
    <div className="min-h-screen pb-28">
      <ProfileHeader profile={site.profile} activeTab={tab} />

      <main className="mx-auto mt-4 grid w-full gap-4 px-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10 xl:grid-cols-[400px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <IntroCard site={site} />
          <MusicCard music={music} />
        </aside>

        <div className="min-w-0">
          {tab === "blogs" && <BlogsPanel posts={posts} site={site} />}
          {tab === "about" && <AboutPanel site={site} />}
          {tab === "education" && <EducationPanel site={site} />}
          {tab === "projects" && <ProjectsPanel site={site} />}
          {tab === "experiences" && <ExperiencesPanel site={site} />}
        </div>
      </main>
    </div>
  );
}
