import { Briefcase, ExternalLink, GraduationCap, Mail, MapPin, Music } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { MusicEntry, SiteData } from "@/lib/types";
import { Card, CardTitle } from "./Card";

export function IntroCard({ site }: { site: SiteData }) {
  const { profile } = site;
  const currentJob = site.experiences[0];
  const currentSchool = site.education[0];

  return (
    <Card>
      <CardTitle>Intro</CardTitle>
      <p className="text-center text-[15px] leading-relaxed">{profile.tagline}</p>
      <hr className="my-4 border-line" />
      <ul className="space-y-3 text-[15px]">
        {currentJob && (
          <li className="flex gap-3">
            <Briefcase size={20} className="mt-0.5 shrink-0 text-muted" />
            <span>
              {currentJob.role} at <strong>{currentJob.company}</strong>
            </span>
          </li>
        )}
        {currentSchool && (
          <li className="flex gap-3">
            <GraduationCap size={20} className="mt-0.5 shrink-0 text-muted" />
            <span>
              Studies at <strong>{currentSchool.school}</strong>
            </span>
          </li>
        )}
        {profile.location && (
          <li className="flex gap-3">
            <MapPin size={20} className="mt-0.5 shrink-0 text-muted" />
            <span>
              Lives in <strong>{profile.location}</strong>
            </span>
          </li>
        )}
        {profile.email && (
          <li className="flex gap-3">
            <Mail size={20} className="mt-0.5 shrink-0 text-muted" />
            <a href={`mailto:${profile.email}`} className="break-all hover:text-accent">
              {profile.email}
            </a>
          </li>
        )}
      </ul>
    </Card>
  );
}

export function MusicCard({ music }: { music: MusicEntry[] }) {
  const [today, ...earlier] = music;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">Music</h2>
        <Music size={18} className="text-accent" />
      </div>

      {!today ? (
        <p className="text-sm text-muted">No song yet — check back later.</p>
      ) : (
        <>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            My music of the day · {formatDate(today.date, { month: "short", year: undefined })}
          </p>
          <div className="flex gap-3">
            <Cover entry={today} size="h-20 w-20" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{today.title}</p>
              <p className="truncate text-sm text-muted">{today.artist}</p>
              {today.spotifyUrl && (
                <a
                  href={today.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  Open in Spotify <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
          {today.note && (
            <p className="mt-3 rounded-lg bg-card-hover p-3 text-sm italic leading-relaxed">
              “{today.note}”
            </p>
          )}

          {earlier.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Earlier days
              </p>
              <ul className="space-y-2">
                {earlier.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="flex items-center gap-3">
                    <Cover entry={entry} size="h-10 w-10" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{entry.title}</p>
                      <p className="truncate text-xs text-muted">
                        {entry.artist} · {formatDate(entry.date, { month: "short", year: undefined })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Card>
  );
}

function Cover({ entry, size }: { entry: MusicEntry; size: string }) {
  return entry.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={entry.coverUrl} alt="" className={`${size} shrink-0 rounded-lg object-cover`} />
  ) : (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent`}>
      <Music size={18} />
    </div>
  );
}
