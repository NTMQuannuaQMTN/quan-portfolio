import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export default function Journey() {
    const journey = [
      {
        year: "2017",
        title: "Interest in Mathematics",
        description:
          "Developed a strong interest in mathematics and problem solving.",
      },
  
      {
        year: "2019",
        title: "Tran Dai Nghia High School for the Gifted",
        description:
          "Entered one of Ho Chi Minh City's leading secondary schools.",
      },
  
      {
        year: "2021",
        title: "Started Coding",
        description:
          "Discovered programming and began building software.",
      },
  
      {
        year: "2022",
        title: "First Major Project",
        description:
          "Built my first project and reached Top 15 nationally in an innovation competition.",
      },
  
      {
        year: "2023",
        title: "VNUHCM High School for the Gifted",
        description:
          "Entered the Mathematics specialized program.",
      },
  
      {
        year: "2025",
        title: "Founder",
        description:
          "Founded Homee and Doorians Lab.",
      },
  
      {
        year: "2026",
        title: "National University of Singapore",
        description:
          "Started studying Computer Science at NUS.",
      },
    ];
  
    return (
      <section
        id="journey"
        className="
          relative
          px-6
          py-24
          lg:px-10
        "
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="
              mb-6
              text-xs
              uppercase
              tracking-[0.4em]
              text-red-500
            "
          >
            Journey
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
            The journey that shaped who I am today.
          </h2>
  
          <div className="mt-20">
            {journey.map((item, index) => (
              <motion.div
                key={item.year}
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
                  relative
                  flex
                  gap-8
                  pb-16
                "
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className="
                      h-4
                      w-4
                      rounded-full
                      bg-red-600
                    "
                  />
  
                  {index !== journey.length - 1 && (
                    <div
                      className="
                        mt-2
                        h-full
                        w-[2px]
                        bg-red-900
                      "
                    />
                  )}
                </div>
  
                <div className="flex-1">
                  <p
                    className="
                      text-sm
                      uppercase
                      tracking-[0.3em]
                      text-red-500
                    "
                  >
                    {item.year}
                  </p>
  
                  <h3
                    className="
                      mt-3
                      text-2xl
                      font-semibold
                      text-white
                      md:text-3xl
                    "
                  >
                    {item.title}
                  </h3>
  
                  <p
                    className="
                      mt-4
                      max-w-2xl
                      text-zinc-400
                      leading-relaxed
                    "
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }