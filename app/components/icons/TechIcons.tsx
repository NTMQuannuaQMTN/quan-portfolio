type IconProps = {
  className?: string;
};

function Glyph({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons: Record<string, (props: IconProps) => React.ReactElement> = {
  typescript: (props) => (
    <Glyph {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12h4M10 12v6" />
      <path d="M15 12.5c0-.8.7-1.5 1.7-1.5s1.7.6 1.7 1.3c0 1.8-3.4 1.3-3.4 3.2 0 .8.8 1.5 1.8 1.5s1.7-.5 1.8-1.2" />
    </Glyph>
  ),
  javascript: (props) => (
    <Glyph {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 9v7c0 1.2-.9 2-2 1.6" />
      <path d="M14 9.5c0-.5.6-1 1.5-1s1.5.5 1.5 1.2c0 1.6-3 1.1-3 2.9 0 .8.8 1.4 1.7 1.4s1.6-.5 1.7-1.1" />
    </Glyph>
  ),
  python: (props) => (
    <Glyph {...props}>
      <path d="M12 3c-2.2 0-4 .6-4 2v3h4" />
      <path d="M8 8H5.5C4 8 3 9.5 3 12s1 4 2.5 4H8" />
      <path d="M12 21c2.2 0 4-.6 4-2v-3h-4" />
      <path d="M16 16h2.5c1.5 0 2.5-1.5 2.5-4s-1-4-2.5-4H16" />
      <circle cx="9.5" cy="5.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="18.5" r=".6" fill="currentColor" stroke="none" />
    </Glyph>
  ),
  react: (props) => (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </Glyph>
  ),
  nextjs: (props) => (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8.5v7M9 8.5l6.5 8" />
      <path d="M15.5 8.5v6" />
    </Glyph>
  ),
  tailwind: (props) => (
    <Glyph {...props}>
      <path d="M4 12c1-3.5 3-5 6-5s4.5 2 6 3c-1 3.5-3 5-6 5s-4.5-2-6-3z" />
      <path d="M2 16c1-3.5 3-5 6-5s4.5 2 6 3" />
    </Glyph>
  ),
  nodejs: (props) => (
    <Glyph {...props}>
      <path d="M12 2.5 20 7v10l-8 4.5-8-4.5V7z" />
      <path d="M12 2.5v19M4 7l8 4.5 8-4.5M4 17l8-4.5 8 4.5" />
    </Glyph>
  ),
  express: (props) => (
    <Glyph {...props}>
      <path d="M3 15c2 0 3-1.5 3-4s1-4 3-4 3 4.5 4.5 7 2.5 3.2 4.5 1c1.3-1.4 1.5-3 1.5-4" />
    </Glyph>
  ),
  fastapi: (props) => (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14 6 9 13h4l-3 5" />
    </Glyph>
  ),
  openai: (props) => (
    <Glyph {...props}>
      <path d="M12 3l8 4.6v9.8L12 21l-8-4.6V7.6z" />
      <circle cx="12" cy="12" r="3" />
    </Glyph>
  ),
  vercel: (props) => (
    <Glyph {...props}>
      <path d="M12 4l9 16H3z" />
    </Glyph>
  ),
  docker: (props) => (
    <Glyph {...props}>
      <rect x="3" y="11" width="4" height="4" />
      <rect x="8" y="11" width="4" height="4" />
      <rect x="13" y="11" width="4" height="4" />
      <rect x="8" y="6" width="4" height="4" />
      <path d="M3 15c0 3.5 2.5 6 7 6h2c4.5 0 8-2.3 9-6z" />
    </Glyph>
  ),
  postgresql: (props) => (
    <Glyph {...props}>
      <path d="M7 4c5-2 11 1 12 6.5 1 5.5-2 10-6.5 10.5-3 .3-4.5-1.2-4.5-3" />
      <path d="M7 4C3.5 5.5 2 9 3 12.5c.7 2.5 2.5 3.7 4 3.5" />
      <path d="M9 14v5M12 15.5V20" />
    </Glyph>
  ),
  supabase: (props) => (
    <Glyph {...props}>
      <path d="M13 3 4 14h7l-1 7 9-11h-7z" />
    </Glyph>
  ),
  git: (props) => (
    <Glyph {...props}>
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M7 9v2c0 2 1 3 3 3M17 9v2c0 2-1 3-3 3" />
    </Glyph>
  ),
  figma: (props) => (
    <Glyph {...props}>
      <path d="M9 3h3a3 3 0 0 1 0 6H9z" />
      <path d="M9 9h3a3 3 0 0 1 0 6H9z" />
      <circle cx="9" cy="18" r="3" />
      <path d="M6 3a3 3 0 0 0 0 6h3V3z" />
    </Glyph>
  ),
};

export default function TechIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
