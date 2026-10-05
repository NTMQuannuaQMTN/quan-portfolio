import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 shadow-card">
        <h1 className="text-2xl font-bold">
          Admin<span className="text-accent">.</span>
        </h1>
        <p className="mb-5 mt-1 text-sm text-muted">Sign in to edit your site.</p>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="rounded-lg bg-accent-soft p-3 text-sm text-accent">
            Set <code>ADMIN_PASSWORD</code> in your environment (e.g. <code>.env.local</code>) and restart the server.
          </p>
        )}
      </div>
    </div>
  );
}
