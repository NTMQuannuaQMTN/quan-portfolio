export default function Skills() {
    const skillGroups = [
      {
        title: "Frontend",
        skills: [
          "React",
          "Next.js",
          "React Native",
          "TailwindCSS",
        ],
      },
  
      {
        title: "Backend",
        skills: [
          "Node.js",
          "Express",
          "Python",
          "FastAPI",
        ],
      },
  
      {
        title: "Database",
        skills: [
          "PostgreSQL",
          "Supabase",
        ],
      },
  
      {
        title: "Tools",
        skills: [
          "Git",
          "Figma",
        ],
      },
    ];
  
    return (
      <section
        id="skills"
        className="
          px-6
          py-24
          lg:px-10
        "
      >
        <div className="mx-auto max-w-7xl">
          <p
            className="
              mb-6
              text-xs
              uppercase
              tracking-[0.4em]
              text-red-500
            "
          >
            Skills
          </p>
  
          <h2
            className="
              max-w-4xl
              text-4xl
              font-semibold
              leading-tight
              tracking-[-0.04em]
              text-white
              md:text-6xl
            "
          >
            Technologies I use to build products.
          </h2>
  
          <div className="mt-16 space-y-12">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="
                  border-b
                  border-white/10
                  pb-10
                "
              >
                <h3
                  className="
                    text-xl
                    font-semibold
                    text-white
                  "
                >
                  {group.title}
                </h3>
  
                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-4
                  "
                >
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-5
                        py-3
                        text-sm
                        text-zinc-300
                        transition
                        hover:border-red-500/40
                        hover:-translate-y-1
                      "
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }