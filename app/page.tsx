"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "./lib/supabase";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import Journey from "./components/Journey";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Blog from "./components/Blog";
import Footer from "./components/Footer";

type BlogPost = {
  title: string;
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("title, link, published")
      .order("published", { ascending: false });

    if (data) {
      setBlogs(data);
    }

    console.log(data);
  };

  const theme = {
    background: "#050505",
    surface: "#0D0D0D",
    card: "#121212",
    text: "#FAFAFA",
    muted: "#A1A1AA",
    accent: "#DC2626",
    accentSoft: "#7F1D1D",
    border: "rgba(255,255,255,0.08)",
  };

  return (
    <main
      style={{
        background: theme.background,
        color: theme.text,
      }}
      className="min-h-screen overflow-x-hidden"
    >
      <Navbar />

      <Hero />

      <Philosophy />

      <Journey />

      <Skills />

      <Experience />

      <Projects />

      <Education />

      <Blog blogs={blogs} />

      <Footer />
    </main>
  );
}