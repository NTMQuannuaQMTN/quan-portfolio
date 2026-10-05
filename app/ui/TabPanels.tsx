import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDate, readingMinutes } from "@/lib/format";
import { formatDuration, formatPeriod, type Period } from "@/lib/period";
import type { BlogPost, Experience, SiteData } from "@/lib/types";
import { Card, CardTitle, EmptyState } from "./Card";
import SeeMore from "./SeeMore";

/* eslint-disable @next/next/no-img-element */

export function BlogsPanel({ posts, site }: { posts: BlogPost[]; site: SiteData }) {
  if (posts.length === 0) return <EmptyState>No posts yet.</EmptyState>;

  return (
    <div className="grid items-start gap-4 2xl:grid-cols-2">
      {posts.map((post) => (
        <article key={post.id} className="overflow-hidden rounded-xl border border-line bg-card shadow-card">
          <div className="flex items-center gap-3 px-4 pt-4">
            <img
              src={site.profile.avatar || "/images/profile-dark.png"}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-[15px] font-semibold">{site.profile.name}</p>
              <p className="text-xs text-muted">
                {formatDate(post.publishedAt ?? post.createdAt)} · {readingMinutes(post.content)} min read
              </p>
            </div>
          </div>

          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="px-4 pb-3 pt-3">
              <h3 className="text-lg font-bold group-hover:text-accent">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-1 line-clamp-3 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
              )}
            </div>
            {post.cover && (
              <img src={post.cover} alt="" className="max-h-[420px] w-full object-cover" />
            )}
          </Link>

          <div className="mx-4 border-t border-line py-1">
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-md py-2 text-center text-sm font-semibold text-muted transition hover:bg-card-hover hover:text-accent"
            >
              Read post
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function AboutPanel({ site }: { site: SiteData }) {
  return (
    <div className="grid items-start gap-4 xl:grid-cols-2">
      <Card className="xl:col-span-2">
        <CardTitle>About me</CardTitle>
        <p className="whitespace-pre-line text-[15px] leading-relaxed">{site.profile.story}</p>
      </Card>

      {site.skills.length > 0 && (
        <Card>
          <CardTitle>Skills</CardTitle>
          <div className="space-y-4">
            {site.skills.map((group) => (
              <div key={group.category}>
                <p className="mb-2 text-sm font-semibold text-muted">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-card-hover px-3 py-1.5 text-sm"
                    >
                      {skill.logo && <img src={skill.logo} alt="" className="h-4 w-4 object-contain" />}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {site.journey.length > 0 && (
        <Card>
          <CardTitle>Journey</CardTitle>
          <ol className="relative ml-2 border-l-2 border-line">
            {site.journey.map((item) => (
              <li key={`${item.year}-${item.title}`} className="relative pb-5 pl-6 last:pb-0">
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-card" />
                <p className="text-xs font-bold text-accent">{item.year}</p>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}

export function EducationPanel({ site }: { site: SiteData }) {
  if (site.education.length === 0) return <EmptyState>Nothing here yet.</EmptyState>;

  return (
    <Card>
      <CardTitle>Education</CardTitle>
      <ul className="divide-y divide-line">
        {site.education.map((edu) => (
          <li key={edu.id ?? edu.school} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            {edu.logo ? (
              <img src={edu.logo} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-line bg-white object-contain p-1" />
            ) : (
              <div className="h-14 w-14 shrink-0 rounded-lg bg-accent-soft" />
            )}
            <div>
              <p className="font-semibold">{edu.school}</p>
              <p className="text-sm">{edu.degree}</p>
              <p className="text-sm text-muted">{formatPeriod(edu.period)}</p>
              {edu.detail && <p className="mt-1 text-sm text-muted">{edu.detail}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Consecutive roles at the same company are grouped, like LinkedIn. */
function groupByCompany(experiences: Experience[]) {
  const groups: Experience[][] = [];
  for (const exp of experiences) {
    const last = groups.at(-1);
    if (last && exp.company && last[0].company.trim().toLowerCase() === exp.company.trim().toLowerCase()) {
      last.push(exp);
    } else {
      groups.push([exp]);
    }
  }
  return groups;
}

/** The span covering every role in a group (for the company's total time). */
function groupPeriod(roles: Experience[]): Period {
  const starts = roles.map((r) => r.period.start).filter(Boolean).sort();
  const ends = roles.map((r) => r.period.end);
  return { start: starts[0] ?? "", end: ends.includes("") ? "" : ends.sort().at(-1) ?? "" };
}

function CompanyLogo({ exp }: { exp: Experience }) {
  return exp.logo ? (
    <img src={exp.logo} alt="" className="h-12 w-12 shrink-0 rounded-md border border-line bg-white object-contain p-0.5" />
  ) : (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-soft text-lg font-bold text-accent">
      {exp.company.charAt(0) || "•"}
    </div>
  );
}

const dot = (...parts: string[]) => parts.filter(Boolean).join(" · ");

function Skills({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;
  return (
    <p className="mt-2 text-sm">
      <span className="font-semibold">Skills: </span>
      {skills.join(" · ")}
    </p>
  );
}

function RoleDetails({ exp, showCompany }: { exp: Experience; showCompany: boolean }) {
  return (
    <>
      <p className="font-semibold">{exp.role}</p>
      <p className="text-sm">{showCompany ? dot(exp.company, exp.employmentType) : exp.employmentType}</p>
      <p className="text-sm text-muted">{dot(formatPeriod(exp.period), formatDuration(exp.period))}</p>
      {(exp.location || exp.locationType) && <p className="text-sm text-muted">{dot(exp.location, exp.locationType)}</p>}
      {exp.description && <SeeMore text={exp.description} className="mt-2" />}
      <Skills skills={exp.tech} />
    </>
  );
}

export function ExperiencesPanel({ site }: { site: SiteData }) {
  if (site.experiences.length === 0) return <EmptyState>Nothing here yet.</EmptyState>;

  return (
    <Card>
      <CardTitle>Experience</CardTitle>
      <ul className="divide-y divide-line">
        {groupByCompany(site.experiences).map((roles) => {
          const [first] = roles;
          if (roles.length === 1) {
            return (
              <li key={first.id ?? `${first.company}-${first.role}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <CompanyLogo exp={first} />
                <div className="min-w-0">
                  <RoleDetails exp={first} showCompany />
                </div>
              </li>
            );
          }
          return (
            <li key={first.id ?? first.company} className="py-4 first:pt-0 last:pb-0">
              <div className="flex gap-3">
                <CompanyLogo exp={first} />
                <div className="min-w-0">
                  <p className="font-semibold">{first.company}</p>
                  <p className="text-sm text-muted">{formatDuration(groupPeriod(roles))}</p>
                </div>
              </div>
              <ol className="ml-6 mt-3">
                {roles.map((exp) => (
                  <li
                    key={exp.id ?? exp.role}
                    className="relative border-l-2 border-line pb-4 pl-[38px] last:border-transparent last:pb-0"
                  >
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-muted ring-4 ring-card" />
                    <RoleDetails exp={exp} showCompany={false} />
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function associationLabel(site: SiteData, value: string) {
  const [kind, id] = value.split(":");
  if (kind === "experience") {
    const exp = site.experiences.find((e) => e.id === id);
    return exp ? { name: dot(exp.role, exp.company), logo: exp.logo, letter: exp.company.charAt(0) } : null;
  }
  if (kind === "education") {
    const edu = site.education.find((e) => e.id === id);
    return edu ? { name: edu.school, logo: edu.logo, letter: edu.school.charAt(0) } : null;
  }
  return null;
}

export function ProjectsPanel({ site }: { site: SiteData }) {
  if (site.projects.length === 0) return <EmptyState>Nothing here yet.</EmptyState>;

  return (
    <Card>
      <CardTitle>Projects</CardTitle>
      <ul className="divide-y divide-line">
        {site.projects.map((project) => {
          const association = associationLabel(site, project.associatedWith);
          return (
            <li
              key={project.id ?? project.title}
              className="flex flex-col-reverse gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{project.title}</h3>
                {project.period.start && <p className="text-sm text-muted">{formatPeriod(project.period)}</p>}
                {association && (
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    {association.logo ? (
                      <img src={association.logo} alt="" className="h-6 w-6 rounded border border-line bg-white object-contain" />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-accent-soft text-xs font-bold text-accent">
                        {association.letter}
                      </span>
                    )}
                    <span>
                      Associated with <span className="font-medium">{association.name}</span>
                    </span>
                  </p>
                )}
                {project.description && <SeeMore text={project.description} className="mt-2 max-w-3xl" />}
                <Skills skills={project.tech} />
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
                  >
                    Show project <ExternalLink size={14} />
                  </a>
                )}
              </div>
              {project.image && (
                <img
                  src={project.image}
                  alt=""
                  className="aspect-video w-full shrink-0 rounded-lg border border-line bg-card-hover object-cover sm:w-56 lg:w-64"
                />
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
