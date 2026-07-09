"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const reversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="grid gap-10 border-t border-white/10 py-16 lg:grid-cols-2 lg:gap-16"
    >
      <div
        className={`self-start overflow-hidden rounded-[2rem] border border-white/10 ${
          reversed ? "lg:order-2" : ""
        }`}
      >
        <div className="relative aspect-[4/3] w-full">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`transition-transform duration-700 hover:scale-105 ${
                "imageFit" in project && project.imageFit === "contain"
                  ? "object-contain bg-white p-10"
                  : "object-cover"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#B3001B]/20 to-black">
              <p className="px-8 text-center text-xs uppercase tracking-[0.3em] text-zinc-500">
                {project.category}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={`flex flex-col justify-center ${reversed ? "lg:order-1" : ""}`}>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-crimson-bright)]">
          {project.category}
        </p>

        <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
          {project.title}
        </h3>

        <p className="mt-6 max-w-xl leading-relaxed text-zinc-400">
          {project.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400"
            >
              {tech}
            </span>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Problem
                  </p>
                  <p className="mt-2 leading-relaxed text-zinc-400">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Solution
                  </p>
                  <p className="mt-2 leading-relaxed text-zinc-400">
                    {project.solution}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Impact
                  </p>
                  <p className="mt-2 leading-relaxed text-zinc-400">
                    {project.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:text-[color:var(--color-crimson-bright)]"
          >
            {expanded ? "Hide Case Study" : "Case Study"}
          </button>

          {project.demoHref && (
            <a
              href={project.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
            >
              Live Demo <ArrowUpRight size={14} />
            </a>
          )}

          {project.githubHref && (
            <a
              href={project.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Projects
        </p>

        <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Building products that create real impact.
        </h2>

        <div className="mt-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
