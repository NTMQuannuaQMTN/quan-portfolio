import type { Period } from "./period";

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  story: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  avatar: string;
  cover: string;
};

export type JourneyItem = { id?: string; year: string; title: string; description: string };

export type Skill = { name: string; logo: string };
export type SkillCategory = { category: string; skills: Skill[] };

export type Education = {
  id?: string;
  period: Period;
  school: string;
  degree: string;
  detail: string;
  logo: string;
};

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal",
] as const;

export const LOCATION_TYPES = ["On-site", "Hybrid", "Remote"] as const;

export type Experience = {
  id?: string;
  role: string;
  employmentType: string;
  company: string;
  logo: string;
  location: string;
  locationType: string;
  period: Period;
  description: string;
  /** Skills */
  tech: string[];
};

export type Project = {
  id?: string;
  title: string;
  description: string;
  /** Skills */
  tech: string[];
  /** Media */
  image: string;
  url: string;
  /** Optional: start "" means no dates. */
  period: Period;
  /** "experience:<id>", "education:<id>" or "" */
  associatedWith: string;
};

export type SiteData = {
  profile: Profile;
  journey: JourneyItem[];
  skills: SkillCategory[];
  education: Education[];
  experiences: Experience[];
  projects: Project[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MusicEntry = {
  id: string;
  /** YYYY-MM-DD, the day this was the song of the day */
  date: string;
  spotifyUrl: string;
  title: string;
  artist: string;
  coverUrl: string;
  note: string;
  createdAt: string;
};
