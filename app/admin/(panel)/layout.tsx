import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { supabaseWritable } from "@/lib/supabase";
import ThemeToggle from "@/app/ui/ThemeToggle";
import { logout } from "../actions";
import AdminNav from "../ui/AdminNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="text-lg font-bold">
            Admin<span className="text-accent">.</span>
          </Link>
          {!supabaseWritable && (
            <span
              className="hidden rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent sm:inline"
              title="Add SUPABASE_SECRET_KEY to .env (Supabase → Project Settings → API Keys), then restart."
            >
              Read-only — add SUPABASE_SECRET_KEY to save
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-card-hover">
              <ExternalLink size={14} /> View site
            </Link>
            <ThemeToggle />
            <form action={logout}>
              <button type="submit" aria-label="Log out" title="Log out" className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card-hover hover:text-accent">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_minmax(0,1fr)]">
        <AdminNav />
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
}
