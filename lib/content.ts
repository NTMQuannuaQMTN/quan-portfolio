import "server-only";
import { db, dbRead, supabaseConfigured } from "./supabase";
import { seedSite } from "./seed";
import { dateFromMonth, monthFromDate, type Period } from "./period";
import type { ListSection } from "./schemas";
import type { BlogPost, MusicEntry, Profile, SiteData, SkillCategory } from "./types";

/* Column names in Supabase ↔ field names in the app. */

const profileColumns: Record<keyof Profile, string> = {
  name: "name",
  role: "role",
  tagline: "tagline",
  location: "location",
  story: "story",
  email: "email",
  github: "github_url",
  linkedin: "linkedin_url",
  resumeUrl: "resume_url",
  avatar: "avatar_url",
  cover: "cover_url",
};

/** Simple list tables (skills is grouped, handled separately). */
const sectionColumns = {
  education: { school: "school", degree: "degree", detail: "detail", logo: "logo_url" },
  experiences: {
    role: "role",
    employmentType: "employment_type",
    company: "company",
    logo: "logo_url",
    location: "location",
    locationType: "location_type",
    description: "description",
    tech: "tech",
  },
  projects: { title: "title", description: "description", tech: "tech", image: "image_url", url: "project_url" },
  journey: { year: "year", title: "title", description: "description" },
} as const satisfies Partial<Record<ListSection, Record<string, string>>>;

type Row = Record<string, unknown>;

/** Sections whose `period` is stored as start_month / end_month (null end = Present). */
const periodSections = new Set<ListSection>(["education", "experiences", "projects"]);

/** Project "Associated with" ↔ associated_experience_id / associated_education_id. */
const associationFromRow = (row: Row) =>
  row.associated_experience_id
    ? `experience:${row.associated_experience_id}`
    : row.associated_education_id
      ? `education:${row.associated_education_id}`
      : "";

function associationToRow(value: unknown) {
  const [kind, id] = typeof value === "string" ? value.split(":") : [];
  return {
    associated_experience_id: kind === "experience" ? id : null,
    associated_education_id: kind === "education" ? id : null,
  };
}

const periodFromRow = (row: Row): Period => ({
  start: monthFromDate(row.start_month),
  end: monthFromDate(row.end_month),
});

function fromRow(columns: Record<string, string>, row: Row) {
  const out: Row = { id: row.id };
  for (const [field, column] of Object.entries(columns)) out[field] = row[column] ?? "";
  return out;
}

function toRow(columns: Record<string, string>, item: Row) {
  const out: Row = {};
  for (const [field, column] of Object.entries(columns)) out[column] = item[field];
  return out;
}

async function selectOrdered(table: string) {
  const { data, error } = await dbRead().from(table).select("*").order("sort_order");
  if (error) throw error;
  return data as Row[];
}

/* ---------- Site ---------- */

export async function getSite(): Promise<SiteData> {
  // Without Supabase (e.g. first local run) show the seed content read-only.
  if (!supabaseConfigured) return seedSite;

  const [profileRes, education, experiences, projects, journey, skills] = await Promise.all([
    dbRead().from("profile").select("*").eq("id", 1).maybeSingle(),
    selectOrdered("education"),
    selectOrdered("experiences"),
    selectOrdered("projects"),
    selectOrdered("journey"),
    selectOrdered("skills"),
  ]);
  if (profileRes.error) throw profileRes.error;

  const profile = profileRes.data
    ? (fromRow(profileColumns, profileRes.data) as Profile)
    : seedSite.profile;

  const groups: SkillCategory[] = [];
  for (const row of skills) {
    const category = String(row.category);
    let group = groups.find((g) => g.category === category);
    if (!group) groups.push((group = { category, skills: [] }));
    group.skills.push({ name: String(row.name), logo: String(row.logo_url ?? "") });
  }

  return {
    profile,
    education: education.map((r) => ({
      ...fromRow(sectionColumns.education, r),
      period: periodFromRow(r),
    })) as SiteData["education"],
    experiences: experiences.map((r) => ({
      ...fromRow(sectionColumns.experiences, r),
      period: periodFromRow(r),
    })) as SiteData["experiences"],
    projects: projects.map((r) => ({
      ...fromRow(sectionColumns.projects, r),
      period: periodFromRow(r),
      associatedWith: associationFromRow(r),
    })) as SiteData["projects"],
    journey: journey.map((r) => fromRow(sectionColumns.journey, r)) as SiteData["journey"],
    skills: groups,
  };
}

/** Update only the given profile fields (e.g. just the photos). */
export async function saveProfile(profile: Partial<Profile>) {
  const row: Row = { id: 1 };
  for (const [field, column] of Object.entries(profileColumns)) {
    const value = profile[field as keyof Profile];
    if (value !== undefined) row[column] = value;
  }
  const { error } = await db().from("profile").upsert(row);
  if (error) throw error;
}

/**
 * Replace a whole section with `items` in the given order: rows missing from
 * the list are deleted, the rest are upserted with their new sort_order.
 */
export async function saveSection(section: ListSection, items: Row[]) {
  if (section === "skills") return saveSkills(items as unknown as SkillCategory[]);

  const columns = sectionColumns[section];
  const rows = items.map((item, index) => ({
    id: typeof item.id === "string" && item.id ? item.id : crypto.randomUUID(),
    ...toRow(columns, item),
    ...(periodSections.has(section) && {
      start_month: dateFromMonth((item.period as Period).start),
      end_month: dateFromMonth((item.period as Period).end),
    }),
    ...(section === "projects" && associationToRow(item.associatedWith)),
    sort_order: index,
  }));

  const keep = rows.map((r) => r.id);
  let del = db().from(section).delete();
  del = keep.length ? del.not("id", "in", `(${keep.join(",")})`) : del.not("id", "is", null);
  const { error: delError } = await del;
  if (delError) throw delError;

  if (rows.length) {
    const { error } = await db().from(section).upsert(rows);
    if (error) throw error;
  }
}

async function saveSkills(groups: SkillCategory[]) {
  const rows = groups.flatMap((g) =>
    g.skills.map((s) => ({ category: g.category, name: s.name, logo_url: s.logo }))
  );
  const { error: delError } = await db().from("skills").delete().not("id", "is", null);
  if (delError) throw delError;
  if (rows.length) {
    const { error } = await db()
      .from("skills")
      .insert(rows.map((r, i) => ({ ...r, sort_order: i })));
    if (error) throw error;
  }
}

/* ---------- Blogs ---------- */

function toPost(row: Row): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    cover: String(row.cover_url ?? ""),
    published: Boolean(row.published),
    publishedAt: (row.published_at as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

/** All posts, newest first (admin). */
export async function getBlogs(): Promise<BlogPost[]> {
  if (!supabaseConfigured) return [];
  const { data, error } = await dbRead().from("blogs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toPost);
}

/** Published posts, newest first. */
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  if (!supabaseConfigured) return [];
  const { data, error } = await dbRead()
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data.map(toPost);
}

export async function getPublishedBlog(slug: string): Promise<BlogPost | null> {
  if (!supabaseConfigured) return null;
  const { data, error } = await dbRead()
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toPost(data) : null;
}

export async function getBlog(id: string): Promise<BlogPost | null> {
  const { data, error } = await dbRead().from("blogs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toPost(data) : null;
}

export async function slugTaken(slug: string, exceptId?: string) {
  let query = db().from("blogs").select("id").eq("slug", slug);
  if (exceptId) query = query.neq("id", exceptId);
  const { data, error } = await query;
  if (error) throw error;
  return data.length > 0;
}

export async function upsertBlog(post: Omit<BlogPost, "createdAt" | "updatedAt" | "publishedAt">) {
  const existing = await getBlog(post.id);
  const { error } = await db()
    .from("blogs")
    .upsert({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_url: post.cover,
      published: post.published,
      // Keep the first publish date when re-publishing.
      published_at: post.published ? existing?.publishedAt ?? new Date().toISOString() : existing?.publishedAt ?? null,
    });
  if (error) throw error;
}

export async function deleteBlog(id: string) {
  const { error } = await db().from("blogs").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- Music ---------- */

function toMusic(row: Row): MusicEntry {
  return {
    id: String(row.id),
    date: String(row.day),
    spotifyUrl: String(row.spotify_url),
    title: String(row.title),
    artist: String(row.artist ?? ""),
    coverUrl: String(row.cover_url ?? ""),
    note: String(row.note ?? ""),
    createdAt: String(row.created_at),
  };
}

/** Newest first. */
export async function getMusic(limit = 50): Promise<MusicEntry[]> {
  if (!supabaseConfigured) return [];
  const { data, error } = await dbRead()
    .from("music")
    .select("*")
    .order("day", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(toMusic);
}

/** Songs from the last `days` days (by song date), newest first. */
export async function getRecentMusic(days: number): Promise<MusicEntry[]> {
  if (!supabaseConfigured) return [];
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const { data, error } = await dbRead()
    .from("music")
    .select("*")
    .gte("day", since)
    .order("day", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data.map(toMusic);
}

export async function upsertMusic(entry: Omit<MusicEntry, "id" | "createdAt"> & { id?: string }) {
  const row = {
    day: entry.date,
    spotify_url: entry.spotifyUrl,
    title: entry.title,
    artist: entry.artist,
    cover_url: entry.coverUrl,
    note: entry.note,
  };
  const { error } = entry.id
    ? await db().from("music").update(row).eq("id", entry.id)
    : await db().from("music").insert(row);
  if (error) throw error;
}

export async function deleteMusic(id: string) {
  const { error } = await db().from("music").delete().eq("id", id);
  if (error) throw error;
}
