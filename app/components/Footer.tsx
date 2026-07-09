import { profile } from "../data/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-white md:text-5xl">
          Let&apos;s build something meaningful.
        </h2>

        <p className="mt-4 text-zinc-400">
          {profile.name} — Computer Science Student, NUS
        </p>

        <div className="mt-10 flex flex-wrap gap-6">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
          >
            GitHub
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
          >
            Email
          </a>
        </div>

        <div className="mt-12 text-sm text-zinc-600">
          © {year} {profile.name}
        </div>
      </div>
    </footer>
  );
}
