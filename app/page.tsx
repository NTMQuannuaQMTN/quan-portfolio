"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "./lib/supabase";

type BlogPost = {
  title: string;
  image: string;
  link: string;
  published: Date;
};

const lightNavItems = [
  "about",
  "hobbies",
  "education",
  "blog",
];

const darkNavItems = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
];

const projects = [
  {
    title: "Literature Board Game Website",
    category: "Education / Interactive Experience",
    description:
      "Built a digital platform supporting interactive literature board games inspired by iconic Vietnamese works like Chí Phèo and Lão Hạc.",
    impact:
      "Used to manage gameplay, players, and educational interactive experiences.",
    image: "/images/project-vddh.JPG",
    href: "https://vu-dai-da-huyet-test2.vercel.app/",
  },
  {
    title: "Accessibility Innovation Project",
    category: "Accessibility / Innovation",
    description:
      "A technology-driven project focused on assisting people with muteness and deafness through more accessible communication experiences.",
    impact:
      "Reached Top 15 nationally in a countrywide innovation competition among 100+ teams.",
    image: "/images/project-ezkomu.png",
    href: "https://ntmquannuaqmtn.github.io/Quan-Quang-Phuoc-8A13/",
  },
  {
    title: "The Noders Community",
    category: "Leadership / Technology Community",
    description:
      "Led technical direction for an AI & technology-focused student community through workshops, projects, and collaborative learning.",
    impact:
      "Built a growing student technology community centered around engineering and innovation.",
    image: "/images/project-kns.JPG",
    href: "https://www.facebook.com/clbkynangso",
  },
];

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    console.log("Fetching blogs...");
    const { data } = await supabase
      .from("blogs")
      .select("title, image, link, published")
      .order("published", { ascending: false });
    
    console.log("Fetching blogs...", data);
    if (data) {
      setBlogs(data);
    }
  };

  const theme = useMemo(
    () => ({
      background: darkMode ? "#050505" : "#F6F0E5",
      surface: darkMode ? "#101010" : "#FFF9F0",
      text: darkMode ? "#F5F5F5" : "#1B1B1B",
      muted: darkMode
        ? "rgba(255,255,255,0.55)"
        : "rgba(0,0,0,0.55)",
      accent: darkMode ? "#FF3B30" : "#D6A441",
      border: darkMode
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.08)",
    }),
    [darkMode]
  );

  return (
    <main
      style={{
        background: theme.background,
        color: theme.text,
      }}
      className="min-h-screen transition-colors duration-700"
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        theme={theme}
      />

      <div className="lg:ml-[220px]">
        <Hero darkMode={darkMode} theme={theme} />
        <About theme={theme} darkMode={darkMode} />

        {!darkMode ? <Hobbies theme={theme} /> : <Skills theme={theme} />}

        {darkMode && (
          <Projects darkMode={darkMode} theme={theme} />
        )}

        {darkMode && <Experience theme={theme} />}

        <Education theme={theme} />

        {!darkMode && (
          <Blog darkMode={darkMode} theme={theme} blogs={blogs} />
        )}
      </div>
    </main>
  );
}

function Navbar({ darkMode, setDarkMode, theme }: any) {
  const navItems = darkMode ? darkNavItems : lightNavItems;

  const handleThemeSwitch = () => {
    setDarkMode(!darkMode);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav
        style={{
          background: darkMode
            ? "rgba(5,5,5,0.75)"
            : "rgba(246,240,229,0.75)",
          borderColor: theme.border,
        }}
        className="fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col justify-between border-r px-8 py-10 backdrop-blur-xl max-lg:h-auto max-lg:w-full max-lg:flex-row max-lg:items-center max-lg:border-b max-lg:border-r-0"
      >
        <div>
          <h1 className="text-2xl font-black">
            qnrj
          </h1>

          <div className="mt-16 flex flex-col gap-3 max-lg:hidden">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="group relative w-fit text-sm uppercase tracking-[0.3em] transition duration-300 hover:translate-x-3"
                style={{ color: theme.muted }}
              >
                <span className={`
                  group-hover:font-bold ${darkMode ? "group-hover:text-[#FF3B30]" : "group-hover:text-[#D6A441]"}
                `}>
                  {item}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 max-lg:flex-row max-lg:items-center">
          <button
            onClick={handleThemeSwitch}
            className="w-fit hover:font-bold text-sm uppercase tracking-[0.3em]"
            style={{ color: theme.accent }}
          >
            {darkMode ? "Life" : "Career"}
          </button>

          <div
            className="flex flex-col gap-2 text-sm max-lg:flex-row"
            style={{ color: theme.muted }}
          >
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/qandrj">Facebook</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/nguyen-truong-manh-quan/">LinkedIn</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/qnrj_arsaldx/">Instagram</a>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-6 right-6 z-50 hidden max-lg:block">
        <div className="flex gap-4 rounded-full border border-white/10 bg-black/20 px-5 py-3 backdrop-blur-xl">
          {navItems.slice(0, 4).map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-xs uppercase tracking-[0.2em] text-white/60"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function Hero({ darkMode, theme }: any) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-8 py-8 lg:px-20">
      <AnimatePresence>
        <motion.div
          key={darkMode ? "dark" : "light"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="grid w-full grid-cols-1 items-center gap-20 lg:grid-cols-2"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ color: theme.accent }}
              className="mb-6 text-xs uppercase tracking-[0.5em]"
            >
              Software Engineer • Builder • Storyteller
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[4rem] mt-8 font-black leading-[1] tracking-[-0.02em] md:text-[4.5rem] lg:text-[5rem] flex flex-col gap-2"
            >
              NGUYỄN
              <br />
              TRƯƠNG
              <br />
              MẠNH QUÂN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mt-6 max-w-xl text-base leading-relaxed"
              style={{ color: theme.muted }}
            >
              {darkMode
                ? "Building impactful digital experiences through engineering, software, and ambitious technical work."
                : "A student, builder, and storyteller documenting memories, growth, creativity, and meaningful experiences."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative mx-auto"
          >
            <div
              style={{
                background: darkMode
                  ? "rgba(255,59,48,0.15)"
                  : "rgba(214,164,65,0.18)",
              }}
              className="absolute -inset-10 blur-3xl"
            />

            <div
              style={{ borderColor: theme.border }}
              className="relative aspect-[4/5] w-[320px] overflow-hidden border md:w-[450px]"
            >
              <img
                src={darkMode ? "/images/profile-dark.png" : "/images/profile-light.png"}
                alt="profile"
                className={`h-full w-full object-cover transition-opacity duration-500`}
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function About({ theme, darkMode }: any) {


  const lightAbout = [
    {
      emoji: "🇻🇳",
      title: "vietnam",
      text: "saigonese since birth. grew up between the chaotic energy of the city and the quiet corners of home, finding inspiration in both the vibrant streets and the comforting familiarity.",
    },
    {
      emoji: "💻",
      title: "coding",
      text: "since 7th grade out of curiosity. somehow turned into late-night debugging sessions, startup internships, and an obsession with building meaningful things.",
    },
    {
      emoji: "⚽",
      title: "sports",
      text: "football fan. arsenal fan. emotional damage every season but still loyal somehow. also into esports and longtime PUBG sessions with friends.",
    },
    {
      emoji: "🎵",
      title: "music",
      text: "sad songs at 2am. keenan te, alexander stewart, eminem when motivation hits. playlists usually switch between heartbreak and ambition with zero transition.",
    },
    {
      emoji: "🌐",
      title: "languages",
      text: "tiếng việt. english. code. occasionally communicating through memes and unfinished late-night thoughts.",
    },
    {
      emoji: "🎨",
      title: "colors",
      text: "red. still red. probably more red. cinematic deep reds, dark crimson, neon red signs at night - if the vibe feels intense enough, it works.",
    },
  ];

  const darkAbout = [
    "I started programming in 7th grade with curiosity for how software could transform imagination into reality.",

    "Since then, I’ve focused on building projects centered around innovation, education, accessibility, and impactful engineering.",

    "My work spans full-stack development, startup environments, educational platforms, and cybersecurity communities — from teaching Python at SOS Village to building systems used in interactive learning experiences.",

    "I’m especially interested in creating products that combine technical depth with genuine human impact.",

    "Long term, I want to become an ambitious builder capable of engineering experiences that are both technically meaningful and emotionally memorable.",
  ];

  return (
    <section
      id="about"
      className="px-8 py-8"
    >
      <div className="max-w-6xl">
        <p
          style={{ color: theme.accent }}
          className="mb-6 text-xs uppercase tracking-[0.4em]"
        >
          About
        </p>

        {/* LIGHT MODE */}
        {!darkMode ? (
          <>
            <h2 className="max-w-4xl text-3xl font-semibold leading-[1.15] tracking-[-0.04em] md:text-4xl">
              A collection of memories, interests, late-night thoughts, and the
              experiences shaping who I am.
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {lightAbout.map((item) => (
                <div
                  key={item.title}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.emoji}
                    </span>

                    <h3 className="text-lg font-medium lowercase tracking-[-0.03em]">
                      {item.title}
                    </h3>
                  </div>

                  <p
                    style={{ color: theme.muted }}
                    className="max-w-xl text-lg leading-relaxed"
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* DARK MODE */
          <>
            <h2 className="max-w-5xl text-3xl font-semibold leading-[1.1] tracking-[-0.04em] md:text-4xl">
              Engineering ambitious ideas into meaningful digital experiences.
            </h2>

            <div className="mt-8 max-w-3xl space-y-6">
              {darkAbout.map((paragraph, index) => (
                <p
                  key={index}
                  style={{ color: theme.muted }}
                  className="text-xl leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Projects({ darkMode, theme }: any) {
  return (
    <section
      id="projects"
      className="px-8 py-16 lg:px-20 lg:py-24"
    >
      <div className="mb-20 flex items-end justify-between">
        <div>
          <p
            style={{ color: theme.accent }}
            className="mb-6 text-xs uppercase tracking-[0.4em]"
          >
            Projects
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Selected Work
          </h2>
        </div>

        {darkMode && (
          <p
            style={{ color: theme.muted }}
            className="hidden max-w-sm text-right text-sm leading-relaxed lg:block"
          >
            Engineering-focused projects, community initiatives, and digital
            experiences.
          </p>
        )}
      </div>

      <div className="space-y-12">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <p
                style={{ color: theme.accent }}
                className="mb-4 text-xs uppercase tracking-[0.3em]"
              >
                {project.category}
              </p>

              <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                {project.title}
              </h3>

              <p
                style={{ color: theme.muted }}
                className="mt-8 max-w-xl text-lg leading-relaxed"
              >
                {project.description}
              </p>
              <p
                style={{ color: theme.accent }}
                className="mt-6 max-w-xl text-sm uppercase tracking-[0.2em]"
              >
                {project.impact}
              </p>
            </div>

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden border transition duration-500 hover:-translate-y-2 ${index % 2 === 1 ? "lg:order-1" : ""
                }`}
              style={{
                borderColor: theme.border,
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="aspect-video h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                  Open Project
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience({ theme }: any) {
  const experiences = [
    {
      year: "2025 — Present",
      company: "doorians lab",
      role: "Co-Founder",
      description:
        "Building websites and applications for startup founders while acting as technical partners and CTOs for early-stage ideas.",
    },
    {
      year: "2025 — Present",
      company: "The Noders Community",
      role: "Software Engineer, CTO",
      description:
        "Leading technical direction for a growing AI & technology community at VNU-HCM High School for the Gifted.",
    },
    {
      year: "2025 — 2026",
      company: "Homee",
      role: "Co-Founder, CTO",
      description:
        "Built and launched a photo-sharing social platform publicly on the App Store for groups and communities.",
    },
    {
      year: "2025",
      company: "ricefield",
      role: "Junior Web Developer",
      description:
        "Developed frontend experiences using ReactJS and TailwindCSS for an X and Reddit-inspired social platform for college students.",
    },
    {
      year: "2024 — 2025",
      company: "Garastem",
      role: "Intern Web Developer",
      description:
        "Developed landing pages, CMS systems, and customer support platforms for a robotics-focused company.",
    },
    {
      year: "2024",
      company: "Digital Skillset Club",
      role: "Co-Founder",
      description:
        "Taught coding and cybersecurity to orphaned students at SOS Village in Ho Chi Minh City.",
    },
  ];

  return (
    <div className="space-y-8 px-8 py-16 lg:px-20" id="experience">
      <h1 className="text-4xl font-semibold leading-[1.1] tracking-[-0.06em] md:text-6xl">
        Experiences that shaped my engineering journey.
      </h1>
      {experiences.map((item, index) => (
        <div
          key={item.company}
          className="group border-b pb-12"
          style={{
            borderColor: theme.border,
          }}
        >
          <div className="flex items-start justify-between gap-8 max-md:flex-col">
            <div>
              <div className="flex items-center gap-5">
                <span
                  style={{ color: theme.accent }}
                  className="text-sm"
                >
                  0{index + 1}
                </span>

                <h3 className="text-3xl font-semibold tracking-[-0.04em] transition-transform duration-300 group-hover:translate-x-2 md:text-5xl">
                  {item.company}
                </h3>
              </div>

              <p
                style={{ color: theme.accent }}
                className="mt-4 ml-10 text-sm uppercase tracking-[0.25em]"
              >
                {item.role}
              </p>
            </div>

            <p
              style={{ color: theme.muted }}
              className="text-sm uppercase tracking-[0.25em]"
            >
              {item.year}
            </p>
          </div>

          <p
            style={{ color: theme.muted }}
            className="mt-8 ml-10 max-w-3xl text-lg leading-relaxed"
          >
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function Hobbies({ theme }: any) {
  const hobbies = [
    {
      title: "Football",
      subtitle: "Arsenal fan",
      description:
        "Equal parts loyalty, suffering, hope, and emotional damage every season. Still supporting Arsenal no matter what.",
    },
    {
      title: "Gaming",
      subtitle: "PUBG & esports",
      description:
        "Late-night PUBG sessions, competitive energy, and growing up around esports culture and online friendships.",
    },
    {
      title: "Music",
      subtitle: "Sad songs & rap",
      description:
        "Keenan Te. Alexander Stewart. Eminem. Music that switches between emotional reflection and pure motivation.",
    },
    {
      title: "Rapping",
      subtitle: "Words & energy",
      description:
        "Writing bars, storytelling through lyrics, and turning emotions, ambition, and experiences into rhythm.",
    },
  ];

  return (
    <section
      id="hobbies"
      className="relative overflow-hidden px-8 py-8"
    >
      {/* subtle background glow */}
      <div
        style={{
          background: "rgba(214,164,65,0.08)",
        }}
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl">
        <p
          style={{ color: theme.accent }}
          className="mb-6 text-xs uppercase tracking-[0.4em]"
        >
          Hobbies
        </p>

        <div className="space-y-12">
          <div
            className="rounded-[2rem] border p-10 lg:p-12"
            style={{
              borderColor: theme.border,
              background: theme.surface,
            }}
          >
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.06em] md:text-6xl">
              The things that keep life meaningful outside the screen.
            </h2>

            <p
              style={{ color: theme.muted }}
              className="mt-6 max-w-3xl text-lg leading-relaxed"
            >
              Beyond software and engineering, a lot of who I am exists inside
              football matches, music playlists, chaotic PUBG sessions, and
              random late-night thoughts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {hobbies.map((hobby, index) => (
              <div
                key={hobby.title}
                className="rounded-[1.5rem] border p-8 transition duration-300 hover:-translate-y-1"
                style={{
                  borderColor: theme.border,
                  background: theme.background,
                }}
              >
                <div className="flex items-center gap-4">
                  <span
                    style={{ color: theme.accent }}
                    className="text-sm uppercase tracking-[0.25em]"
                  >
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                      {hobby.title}
                    </h3>
                    <p
                      style={{ color: theme.accent }}
                      className="mt-2 text-sm uppercase tracking-[0.25em]"
                    >
                      {hobby.subtitle}
                    </p>
                  </div>
                </div>

                <p
                  style={{ color: theme.muted }}
                  className="mt-6 text-lg leading-relaxed"
                >
                  {hobby.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Education({ theme }: any) {
  const schools = [
    {
      year: "2020 — 2023",
      name: "Tran Dai Nghia High School for the Gifted",
      achievements: [
        "First prize city math olympiad (9th grade)",
        "Top 15 National Innovation Competition of designing for the disabilities (9th grade)",
        "Top 40 FutureU National Innovation Competition (7th grade)",
      ],
      logo: "/images/logo-tdn.png",
    },
    {
      year: "2023 — 2026",
      name: "VNUHCM High School for the Gifted",
      achievements: [
        "First prize city math olympiad (12th grade)",
        "First prize city math calculation with calculators competition (12th grade)",
      ],
      logo: "/images/logo-ptnk.png",
    },
    {
      year: "2026 — 2030",
      name: "National University of Singapore",
      achievements: [
        "Computer Science",
        "Research, innovation, and global learning",
      ],
      logo: "/images/logo-nus.png",
    },
  ];

  const timelineYears = ["2019", "2023", "2026", "2030"];

  return (
    <section
      id="education"
      className="relative overflow-hidden min-h-screen px-6 py-6 lg:px-12"
    >
      <div className="relative z-10 max-w-7xl">
        <p
          style={{ color: theme.accent }}
          className="mb-6 text-xs uppercase tracking-[0.4em]"
        >
          Education
        </p>

        <div
          className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-8 shadow-2xl"
          style={{ borderColor: theme.border }}
        >
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.06em] md:text-6xl">
            The places that shaped my way of thinking.
          </h2>

          <p
            style={{ color: theme.muted }}
            className="mt-6 max-w-3xl text-lg leading-relaxed"
          >
            From gifted education environments in Vietnam to pursuing Computer
            Science internationally at NUS.
          </p>
        </div>

        <div className="mt-12 grid gap-0 lg:grid-cols-[140px_1fr]">
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-px bg-white/10" />

            <div className="space-y-62 text-xs uppercase tracking-[0.35em]"
              style={{ color: theme.accent }}>
              {timelineYears.map((year, index) => (
                <div key={year} className="relative pl-8">
                  {year}
                  <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#D6A441]/80" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {schools.map((school) => (
              <div
                key={school.name}
                className="group relative pl-4 h-60 ml-auto max-w-5xl overflow-hidden rounded-[2rem] border transition duration-300 hover:-translate-y-1"
                style={{
                  borderColor: theme.border,
                  background: "linear-gradient(135deg, #D6A441 0%, #FFFFFF 100%)",
                }}
              >
                <div className="flex gap-8 p-6 items-center h-full">
                  {/* LEFT: Logo */}
                  <div className="relative h-48 w-48 overflow-hidden bg-white/5 flex items-center justify-center my-auto">
                    <img
                      src={school.logo}
                      alt={`${school.name} logo`}
                      className="h-full w-full"
                    />
                  </div>

                  {/* RIGHT: Content */}
                  <div className="relative z-10 flex flex-1 flex-col justify-between text-black">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-black/70">
                        {school.year}
                      </p>
                      <h3 className="text-2xl font-semibold leading-tight md:text-3xl">
                        {school.name}
                      </h3>
                    </div>

                    <div>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-black">
                        Achievements:
                      </p>
                      <ul className="text-sm leading-relaxed text-black/80">
                        {school.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-black/60">+</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Blog({ darkMode, theme, blogs }: any) {
  const { scrollY } = useScroll();

  return (
    <section
      id="blog"
      className="relative overflow-hidden px-8 py-32 lg:px-20"
    >
      {/* glow */}
      <motion.div
        style={{
          y: useTransform(scrollY, [0, 1000], [0, 200]),
        }}
        className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: darkMode
              ? "rgba(255,0,0,0.08)"
              : "rgba(214,164,65,0.08)",
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p
            style={{ color: theme.accent }}
            className="mb-6 text-xs uppercase tracking-[0.4em]"
          >
            Thoughts
          </p>

          <h2 className="max-w-5xl text-4xl font-semibold leading-[1.1] tracking-[-0.06em] md:text-7xl">
            {darkMode
              ? "Technology should feel human, not distant."
              : "The most meaningful things in life are often invisible at first."}
          </h2>

          <p
            style={{ color: theme.muted }}
            className="mt-10 max-w-2xl text-lg leading-relaxed"
          >
            A cinematic journal about growth, creativity, engineering,
            ambition, memories, and moments worth keeping.
          </p>
        </motion.div>

        {/* BLOG POSTS */}
        <div className="flex gap-4 overflow-x-auto rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 pb-6">
          {blogs?.map((post: any, index: number) => (
            <motion.a
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.2 }}
              className="group flex-none w-[32%] min-w-[320px] overflow-hidden rounded-[2rem] border border-white/20 bg-[rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-t-[2rem]">
                {post.image ? (
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.8 }}
                    className="h-[220px] w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-[220px] w-full items-center justify-center text-2xl font-medium"
                    style={{
                      background: darkMode
                        ? "#111"
                        : "#f5f1e8",
                      color: theme.muted,
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-4 flex items-center justify-between gap-4 text-sm uppercase tracking-[0.3em]">
                  <span
                    style={{ color: theme.accent }}
                    className="font-semibold"
                  >
                    Journal / {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-black/60">
                    {new Date(post.published).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-black">
                  {post.title}
                </h3>

                <p
                  style={{ color: theme.muted }}
                  className="mt-6 text-lg leading-relaxed"
                >
                  Open post →
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ theme }: any) {
  const skillGroups = [
    {
      title: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "React Native",
      ],
    },
    {
      title: "Backend",
      skills: [
        "Node.js",
        "Express",
        "Python",
        "FastAPI",
        "REST APIs",
      ],
    },
    {
      title: "Database",
      skills: [
        "Supabase",
        "PostgreSQL",
      ],
    },
    {
      title: "Other",
      skills: [
        "Teaching",
        "Leadership",
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="relative overflow-hidden px-8 py-8"
    >
      {/* background glow */}
      <div
        style={{
          background: "rgba(255,59,48,0.12)",
        }}
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl">
        <p
          style={{ color: theme.accent }}
          className="mb-6 text-xs uppercase tracking-[0.4em]"
        >
          Skills
        </p>

        <div className="grid gap-20 lg:grid-cols-[0.8fr_1.4fr]">
          {/* LEFT */}
          <div>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.06em] md:text-6xl">
              Building with both engineering and intention.
            </h2>

            <p
              style={{ color: theme.muted }}
              className="mt-10 max-w-md text-lg leading-relaxed"
            >
              Combining technical depth, product thinking, and creative
              storytelling to build meaningful digital experiences.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-14">
            {skillGroups.map((group, index) => (
              <div
                key={group.title}
                className="group border-b pb-10"
                style={{
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-center gap-5">
                  <span
                    style={{ color: theme.accent }}
                    className="text-sm"
                  >
                    0{index + 1}
                  </span>

                  <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-4xl">
                    {group.title}
                  </h3>
                </div>

                <div className="mt-8 ml-10 flex flex-wrap gap-4">
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                      className="rounded-full border px-5 py-3 text-base tracking-[-0.02em] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-white/5"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}