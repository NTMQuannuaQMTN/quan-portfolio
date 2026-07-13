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
  openai: (props) => (
    <Glyph {...props}>
      <path d="M12 3l8 4.6v9.8L12 21l-8-4.6V7.6z" />
      <circle cx="12" cy="12" r="3" />
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
