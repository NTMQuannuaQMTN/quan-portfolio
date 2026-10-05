import Link from "next/link";
import { FileText, Mail } from "lucide-react";
import type { Profile } from "@/lib/types";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import ThemeToggle from "./ThemeToggle";

export const TABS = [
  { id: "blogs", label: "Blogs" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experiences", label: "Experiences" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export default function ProfileHeader({
  profile,
  activeTab,
}: {
  profile: Profile;
  activeTab?: TabId;
}) {
  return (
    <header className="border-b border-line bg-card shadow-card">
      {/* Cover: full width */}
      <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-br from-accent via-[#5c000d] to-black sm:h-[300px] lg:h-[380px]">
        {profile.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10">
        {/* Avatar + name + actions */}
        <div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative z-10 -mt-20 shrink-0 rounded-full bg-card p-1 sm:-mt-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar || "/images/profile-dark.png"}
                alt={profile.name}
                className="h-40 w-40 rounded-full object-cover ring-1 ring-line sm:h-44 sm:w-44"
              />
            </div>

            <div className="min-w-0 flex-1 pb-1 text-center sm:pb-4 sm:text-left">
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{profile.name}</h1>
              <p className="mt-1 font-medium text-accent">{profile.role}</p>
              <p className="mt-0.5 text-sm text-muted">{profile.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition hover:bg-accent-hover"
                >
                  <Mail size={16} /> Contact
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-card-hover px-4 text-sm font-semibold transition hover:text-accent"
                >
                  <FileText size={16} /> Resume
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card-hover transition hover:text-accent"
                >
                  <GithubIcon className="h-[18px] w-[18px]" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card-hover transition hover:text-accent"
                >
                  <LinkedinIcon className="h-[18px] w-[18px]" />
                </a>
              )}
              <ThemeToggle />
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-2 border-t border-line" aria-label="Profile sections">
            <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none]">
              {TABS.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <li key={tab.id} className="shrink-0">
                    <Link
                      href={tab.id === "blogs" ? "/" : `/?tab=${tab.id}`}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className={`relative block px-4 py-4 text-[15px] font-semibold transition ${
                        active
                          ? "text-accent"
                          : "rounded-lg text-muted hover:bg-card-hover hover:text-fg"
                      }`}
                    >
                      {tab.label}
                      {active && (
                        <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-accent" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
