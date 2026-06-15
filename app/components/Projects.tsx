export default function Projects() {
    const featuredProject = {
      title: "Doorians Lab",
      subtitle: "Software Studio",
      description:
        "Building software products for educational organizations, startups, and student communities. Acting as technical partner, product builder, and engineering lead.",
    };
  
    const projects = [
      {
        title: "SAT Champions",
        category: "Doorians Lab Client",
        description:
          "AI-powered SAT learning platform with classes, assignments, analytics, and educational tools.",
        image: "/images/project-satchampions.png",
      },
  
      {
        title: "PTNK Mash",
        category: "Doorians Lab Client",
        description:
          "Digital platform for students and educational initiatives.",
        image: "/images/project-mash.png",
      },
  
      {
        title: "Homee",
        category: "Startup",
        description:
          "Social platform built around student communities and groups.",
        image: "/images/project-homee.png",
      },
  
      {
        title: "Accessibility Innovation Project",
        category: "Innovation",
        description:
          "Top 15 National Innovation Competition project supporting people with hearing and speech disabilities.",
        image: "/images/project-accessibility.png",
      },
  
      {
        title: "Literature Board Game Platform",
        category: "Education",
        description:
          "Interactive educational platform built around a custom literature board game.",
        image: "/images/project-boardgame.png",
      },
    ];
  
    return (
      <section
        id="projects"
        className="px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500">
            Projects
          </p>
  
          <h2 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            Building products that create real impact.
          </h2>
  
          {/* Featured */}
  
          <div
            className="
              mt-16
              overflow-hidden
              rounded-[2rem]
              border
              border-red-500/20
              bg-gradient-to-br
              from-red-950
              to-black
              p-10
              lg:p-16
            "
          >
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">
              Featured
            </p>
  
            <h3 className="mt-4 text-5xl font-bold text-white">
              Doorians Lab
            </h3>
  
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {featuredProject.description}
            </p>
  
            <div className="mt-10 flex flex-wrap gap-4">
              {["SAT Champions", "PTNK Mash", "Future Projects"].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      rounded-full
                      border
                      border-white/10
                      px-4
                      py-2
                      text-sm
                      text-zinc-300
                    "
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
  
          {/* Other Projects */}
  
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.title}
                className="
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.02]
                "
              >  
                <div className="p-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-500">
                    {project.category}
                  </p>
  
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    {project.title}
                  </h3>
  
                  <p className="mt-4 leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }