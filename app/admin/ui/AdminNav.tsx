"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/music", label: "Music of the day" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experiences", label: "Experiences" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex gap-1 md:sticky md:top-20 md:flex-col">
        {LINKS.map(({ href, label }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-accent-soft text-accent" : "text-muted hover:bg-card-hover hover:text-fg"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
