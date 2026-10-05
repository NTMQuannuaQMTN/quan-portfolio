import { coercePeriod, currentMonth } from "./period";
import { EMPLOYMENT_TYPES, LOCATION_TYPES, type SiteData } from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "file"
  | "tags"
  | "skills"
  | "period"
  | "select"
  | "association";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  /** select: allowed values ("" = not set) */
  options?: readonly string[];
  /** period: dates may be left empty */
  optional?: boolean;
  /** period: label of the "currently" checkbox */
  currentLabel?: string;
  /** Show at half width next to another half field */
  half?: boolean;
};

const ASSOCIATION_RE = /^(experience|education):[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const profileFields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "story", label: "About me", type: "textarea" },
  { name: "email", label: "Email", type: "text" },
  { name: "github", label: "GitHub URL", type: "url" },
  { name: "linkedin", label: "LinkedIn URL", type: "url" },
  { name: "resumeUrl", label: "Resume", type: "file", help: "Upload a PDF or paste a link." },
  // Profile picture and cover photo are edited with the photo editor (ProfilePhotos).
];

/** Editable list sections of SiteData, keyed by property name. */
export const listSections = {
  education: {
    title: "Education",
    itemLabel: "school",
    fields: [
      { name: "school", label: "School", type: "text" },
      { name: "degree", label: "Degree / program", type: "text" },
      { name: "period", label: "Dates", type: "period", currentLabel: "I am currently studying here" },
      { name: "detail", label: "Details", type: "textarea" },
      { name: "logo", label: "Logo", type: "image" },
    ],
  },
  experiences: {
    title: "Experiences",
    itemLabel: "role",
    fields: [
      { name: "role", label: "Title", type: "text", placeholder: "Ex: Software Engineer" },
      { name: "employmentType", label: "Employment type", type: "select", options: EMPLOYMENT_TYPES, half: true },
      { name: "company", label: "Company or organization", type: "text", half: true },
      { name: "period", label: "Dates", type: "period", currentLabel: "I am currently working in this role" },
      { name: "location", label: "Location", type: "text", placeholder: "Ex: Singapore", half: true },
      { name: "locationType", label: "Location type", type: "select", options: LOCATION_TYPES, half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "tech", label: "Skills", type: "tags", help: "Comma separated." },
      { name: "logo", label: "Company logo", type: "image" },
    ],
  },
  projects: {
    title: "Projects",
    itemLabel: "title",
    fields: [
      { name: "title", label: "Project name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "tech", label: "Skills", type: "tags", help: "Comma separated." },
      { name: "image", label: "Media", type: "image" },
      { name: "period", label: "Dates", type: "period", optional: true, currentLabel: "I am currently working on this project" },
      { name: "associatedWith", label: "Associated with", type: "association" },
      { name: "url", label: "Project URL", type: "url", placeholder: "https://" },
    ],
  },
  journey: {
    title: "Journey",
    itemLabel: "title",
    fields: [
      { name: "year", label: "Year", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  skills: {
    title: "Skills",
    itemLabel: "category",
    fields: [
      { name: "category", label: "Category", type: "text" },
      {
        name: "skills",
        label: "Skills",
        type: "skills",
        help: "One per line. Optionally add a logo URL after a |, e.g. “React | https://…/react.svg”.",
      },
    ],
  },
} satisfies Record<string, { title: string; itemLabel: string; fields: Field[] }>;

export type ListSection = keyof typeof listSections & keyof SiteData;

export function isListSection(key: string): key is ListSection {
  return Object.prototype.hasOwnProperty.call(listSections, key);
}

/** Coerce untrusted input into an object with exactly the schema's fields. */
export function coerce(fields: Field[], input: unknown): Record<string, unknown> {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const value = src[field.name];
    if (field.type === "tags") {
      out[field.name] = Array.isArray(value)
        ? value.map(String).map((s) => s.trim()).filter(Boolean)
        : String(value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    } else if (field.type === "period") {
      out[field.name] = coercePeriod(value, field.optional) ?? { start: currentMonth(), end: "" };
    } else if (field.type === "select") {
      out[field.name] = typeof value === "string" && field.options?.includes(value) ? value : "";
    } else if (field.type === "association") {
      out[field.name] = typeof value === "string" && ASSOCIATION_RE.test(value) ? value : "";
    } else if (field.type === "skills") {
      out[field.name] = Array.isArray(value)
        ? value
            .map((s) => ({ name: String(s?.name ?? "").trim(), logo: String(s?.logo ?? "").trim() }))
            .filter((s) => s.name)
        : [];
    } else {
      out[field.name] = typeof value === "string" ? value.trim() : "";
    }
  }
  return out;
}

/** Text <-> skills conversions for the "skills" field type. */
export function skillsToText(skills: { name: string; logo: string }[]) {
  return skills.map((s) => (s.logo ? `${s.name} | ${s.logo}` : s.name)).join("\n");
}

export function textToSkills(text: string) {
  return text
    .split("\n")
    .map((line) => {
      const [name, ...rest] = line.split("|");
      return { name: name.trim(), logo: rest.join("|").trim() };
    })
    .filter((s) => s.name);
}
