import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export default function Experience() {
    const experiences = [
      {
        period: "2025 — Present",
        company: "Doorians Lab",
        role: "Founder",
        description:
          "Building software solutions for educational organizations, startups, and student communities. Acting as both technical lead and product builder.",
      },
  
      {
        period: "2025 — Present",
        company: "Homee",
        role: "Founder",
        description:
          "Developing a social platform designed around student groups, communities, and meaningful interactions.",
      },
  
      {
        period: "2025 — Present",
        company: "The Noders Community",
        role: "Chief Technology Officer",
        description:
          "Leading technical direction for an AI and technology community impacting students through events, workshops, and projects.",
      },
  
      {
        period: "2025",
        company: "Ricefield",
        role: "Junior Web Developer",
        description:
          "Built frontend experiences using React and modern web technologies for a student-focused social platform.",
      },
  
      {
        period: "2024 — 2025",
        company: "Garastem",
        role: "Software Engineering Intern",
        description:
          "Developed landing pages, CMS systems, and customer-facing platforms for a robotics company.",
      },
  
      {
        period: "2024",
        company: "Digital Skillset Club",
        role: "Co-Founder",
        description:
          "Taught programming and cybersecurity to students at SOS Children's Village in Ho Chi Minh City.",
      },
    ];
  
    return (
      <section
        id="experience"
        className="
          relative
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
            Experience
          </p>
  
          <h2
            className="
              max-w-5xl
              text-4xl
              font-semibold
              leading-tight
              tracking-[-0.04em]
              text-white
              md:text-6xl
            "
          >
            Building products,
            communities, and opportunities.
          </h2>
  
          <div className="mt-20 space-y-8">
            {experiences.map((item, index) => (
              <motion.div
                key={item.company}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="
                  group
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  p-8
                  transition
                  hover:border-red-500/20
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                  "
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className="
                          text-sm
                          text-red-500
                        "
                      >
                        0{index + 1}
                      </span>
  
                      <h3
                        className="
                          text-2xl
                          font-semibold
                          text-white
                          md:text-4xl
                        "
                      >
                        {item.company}
                      </h3>
                    </div>
  
                    <p
                      className="
                        mt-3
                        text-sm
                        uppercase
                        tracking-[0.25em]
                        text-red-500
                      "
                    >
                      {item.role}
                    </p>
                  </div>
  
                  <p
                    className="
                      text-sm
                      uppercase
                      tracking-[0.25em]
                      text-zinc-500
                    "
                  >
                    {item.period}
                  </p>
                </div>
  
                <p
                  className="
                    mt-8
                    max-w-4xl
                    text-lg
                    leading-relaxed
                    text-zinc-400
                  "
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }