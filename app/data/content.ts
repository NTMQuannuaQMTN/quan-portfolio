export const profile = {
  name: "Nguyễn Trương Mạnh Quân",
  nameLines: ["NGUYỄN TRƯƠNG", "MẠNH QUÂN"],
  role: "Software Engineer",
  tagline: "Computer Science Student • Builder",
  heroSubline:
    "Building AI-powered products, beautiful interfaces, and scalable systems.",
  statement: "I love solving real-world problems through software.",
  story:
    "Hi, my name is Quan Nguyen. I'm a software engineer and computer science student passionate about building impactful products. I enjoy working on AI-powered applications, designing intuitive user interfaces, and developing scalable systems. My journey in technology has been driven by curiosity, creativity, and a desire to make a positive difference in the world.",
  email: "nguyentruongmanhquan@gmail.com",
  github: "https://github.com/NTMQuannuaQMTN",
  linkedin: "https://www.linkedin.com/in/nguyen-truong-manh-quan/",
  resumeUrl: "/resume.pdf",
};

export const stats = [
  { label: "Years Coding", value: "5+" },
  { label: "Organizations", value: "6" },
  { label: "Projects", value: "10+" },
];

export const journey = [
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
    description: "Discovered programming and began building software.",
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
    description: "Entered the Mathematics specialized program.",
  },
  {
    year: "2024",
    title: "Teaching & Competitive Programming",
    description:
      "Co-founded a club teaching programming and cybersecurity, while competing in programming contests.",
  },
  {
    year: "2025",
    title: "Founder",
    description: "Founded Homee and Doorians Lab.",
  },
  {
    year: "2026",
    title: "National University of Singapore",
    description: "Started studying Computer Science at NUS.",
  },
];

export type SkillCategory = {
  category: string;
  skills: { name: string; icon: string }[];
};

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "React Native", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "FastAPI", icon: "fastapi" },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "OpenAI API", icon: "openai" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "Vercel", icon: "vercel" },
      { name: "Cloudflare", icon: "cloudflare" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Supabase", icon: "supabase" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: "git" },
      { name: "Figma", icon: "figma" },
    ],
  },
];

export const experiences = [
  {
    period: "2025 — Present",
    company: "Doorians Lab",
    role: "Founder",
    description:
      "Building software solutions for educational organizations, startups, and student communities. Acting as both technical lead and product builder.",
    tech: ["Next.js", "TypeScript", "Supabase"],
  },
  {
    period: "2025 — Present",
    company: "Homee",
    role: "Founder",
    description:
      "Developing a social platform designed around student groups, communities, and meaningful interactions.",
    tech: ["React Native", "Node.js", "PostgreSQL"],
  },
  {
    period: "2025 — Present",
    company: "The Noders Community",
    role: "Chief Technology Officer",
    description:
      "Leading technical direction for an AI and technology community impacting students through events, workshops, and projects.",
    tech: ["Leadership", "AI", "Community"],
  },
  {
    period: "2025",
    company: "Ricefield",
    role: "Junior Web Developer",
    description:
      "Built frontend experiences using React and modern web technologies for a student-focused social platform.",
    tech: ["React", "JavaScript", "CSS"],
  },
  {
    period: "2024 — 2025",
    company: "Garastem",
    role: "Software Engineering Intern",
    description:
      "Developed landing pages, CMS systems, and customer-facing platforms for a robotics company.",
    tech: ["Next.js", "CMS", "Tailwind CSS"],
  },
  {
    period: "2024",
    company: "Digital Skillset Club",
    role: "Co-Founder",
    description:
      "Taught programming and cybersecurity to students at SOS Children's Village in Ho Chi Minh City.",
    tech: ["Teaching", "Python", "Security Fundamentals"],
  },
];

export const projects = [
  {
    title: "Literature Board Game Platform",
    category: "Education / Interactive Experience",
    problem:
      "Vietnamese literature classics like Chí Phèo and Lão Hạc are hard for students to engage with through text alone.",
    solution:
      "Built a digital platform supporting an interactive board game that turns these stories into a playable, social learning experience.",
    impact:
      "Used to manage gameplay, players, and educational interactive experiences in classroom settings.",
    tech: ["React", "JavaScript", "CSS"],
    image: "/images/project-vddh.JPG",
    imageWidth: 612,
    imageHeight: 294,
    demoHref: "https://vu-dai-da-huyet-test2.vercel.app/",
    githubHref: null,
  },
  {
    title: "Accessibility Innovation Project",
    category: "Accessibility / Innovation",
    problem:
      "People with muteness and deafness often face barriers to fast, natural communication.",
    solution:
      "Designed and built a technology-driven communication tool focused on making everyday interaction more accessible.",
    impact:
      "Reached Top 15 nationally in a countrywide innovation competition among 100+ teams.",
    tech: ["JavaScript", "HTML/CSS", "Product Design"],
    image: "/images/project-ezkomu.png",
    imageWidth: 384,
    imageHeight: 287,
    demoHref: "https://ntmquannuaqmtn.github.io/Quan-Quang-Phuoc-8A13/",
    githubHref: null,
  },
  {
    title: "The Noders Community",
    category: "Leadership / Technology Community",
    problem:
      "Students interested in AI and technology lacked a hands-on, project-driven community to learn from.",
    solution:
      "Led technical direction for the community through workshops, projects, and collaborative learning initiatives.",
    impact:
      "Built a growing student technology community centered around engineering and innovation.",
    tech: ["Leadership", "Curriculum Design", "AI"],
    image: "/images/project-kns.JPG",
    imageWidth: 1080,
    imageHeight: 1080,
    demoHref: "https://www.facebook.com/clbkynangso",
    githubHref: null,
  },
];

export const achievements = [
  {
    title: "Top 15 Nationally — Innovation Competition",
    category: "Award",
    description:
      "Ranked Top 15 among 100+ teams nationwide for an accessibility-focused innovation project.",
  },
  {
    title: "Chief Technology Officer, The Noders Community",
    category: "Leadership",
    description:
      "Leading technical direction for an AI & technology community impacting students through events and projects.",
  },
  {
    title: "Co-Founder, Digital Skillset Club",
    category: "Teaching",
    description:
      "Taught programming and cybersecurity fundamentals to students at SOS Children's Village, Ho Chi Minh City.",
  },
  {
    title: "Founder, Doorians Lab & Homee",
    category: "Entrepreneurship",
    description:
      "Founded two ventures: a software studio for educational organizations, and a social platform for student communities.",
  },
  {
    title: "Competitive Programming",
    category: "Competition",
    description:
      "Actively competed in programming contests while building a foundation in algorithms and problem solving.",
  },
];

export const education = [
  {
    period: "2026 — 2030",
    school: "National University of Singapore",
    degree: "B.Comp, Computer Science",
    detail: "Coursework: Data Structures & Algorithms, Systems Programming, AI Foundations.",
    logo: "/images/logo-nus.png",
    logoWidth: 744,
    logoHeight: 769,
  },
  {
    period: "2023 — 2026",
    school: "VNUHCM High School for the Gifted",
    degree: "Mathematics Specialized Program",
    detail: "Advanced mathematics and problem-solving track.",
    logo: "/images/logo-ptnk.png",
    logoWidth: 224,
    logoHeight: 224,
  },
  {
    period: "2019 — 2023",
    school: "Tran Dai Nghia High School for the Gifted",
    degree: "Secondary Education",
    detail: "Started programming and competed in first innovation competitions.",
    logo: "/images/logo-tdn.png",
    logoWidth: 1214,
    logoHeight: 800,
  },
];
