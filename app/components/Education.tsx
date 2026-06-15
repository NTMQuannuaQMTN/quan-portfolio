export default function Education() {
    const schools = [
      {
        period: "2026 — 2030",
        school: "National University of Singapore",
        degree: "Computer Science",
        logo: "/images/logo-nus.png",
      },
  
      {
        period: "2023 — 2026",
        school: "VNUHCM High School for the Gifted",
        degree: "Mathematics Specialized Program",
        logo: "/images/logo-ptnk.png",
      },
  
      {
        period: "2019 — 2023",
        school: "Tran Dai Nghia High School for the Gifted",
        degree: "Secondary Education",
        logo: "/images/logo-tdn.png",
      },
    ];
  
    return (
      <section
        id="education"
        className="px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500">
            Education
          </p>
  
          <h2 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            The institutions that shaped my journey.
          </h2>
  
          <div className="mt-16 space-y-8">
            {schools.map((school) => (
              <div
                key={school.school}
                className="
                  flex
                  flex-col
                  gap-6
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.02]
                  p-8
                  md:flex-row
                  md:items-center
                "
              >
                <img
                  src={school.logo}
                  alt={school.school}
                  className="h-20 w-20 object-contain"
                />
  
                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.25em] text-red-500">
                    {school.period}
                  </p>
  
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {school.school}
                  </h3>
  
                  <p className="mt-2 text-zinc-400">
                    {school.degree}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }