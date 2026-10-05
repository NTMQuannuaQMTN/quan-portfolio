# quan-portfolio

Personal portfolio + blog with a Facebook-style profile page and an admin panel.

- `/` — profile with tabs: Blogs, About, Education, Projects, Experiences, plus the
  "My music of the day" card and a floating player that autoplays the latest song.
- `/blog/[slug]` — a blog post (Markdown).
- `/admin` — edit everything: profile, sections, blog posts, music of the day.

## Set up Supabase

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables
   (`profile`, `education`, `experiences`, `projects`, `skills`, `journey`, `blogs`, `music`),
   read-only RLS policies and the public `media` storage bucket.
3. Then run [`supabase/seed.sql`](supabase/seed.sql) to load your current portfolio content
   (run it only once, on a fresh database: it replaces the list tables).
4. In `.env` (and your host's environment variables) set:
   - `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`: enough for the public site to read content.
   - `SUPABASE_SECRET_KEY` (Project Settings → API Keys → Secret keys, `sb_secret_…`): needed
     for saving from `/admin` and uploading photos. Server-only; never commit or share it.
   - `ADMIN_PASSWORD`: the password for `/admin`.

Without Supabase the site still renders the seed content from `lib/seed.ts`, read-only.

## Admin

Go to `/admin` and sign in with `ADMIN_PASSWORD`. **Profile** has the profile picture and cover
photo editor (uploaded to the `media` bucket under `avatars/` and `covers/`), plus your name,
links and About text.

## Run locally

```bash
cp .env.example .env   # set ADMIN_PASSWORD and the Supabase values
npm install
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin.

## Music of the day

Paste a Spotify share link in **Admin → Music of the day**. The title, artist and cover are
filled in automatically, and the newest song plays in the corner widget via the Spotify embed.

- Spotify only plays a **30-second preview** to visitors who aren't logged in to Spotify in
  that browser; logged-in visitors hear the full song.
- Browsers may block autoplay until the visitor interacts with the page. The widget tries to
  play straight away and otherwise starts on the first click or key press.
