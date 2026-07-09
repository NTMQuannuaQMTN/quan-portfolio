"use client";

import { motion } from "framer-motion";
import { experiences } from "../data/content";
import MouseGlow from "./effects/MouseGlow";

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden px-6 py-24 lg:px-10">
      <MouseGlow size={520} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Experience
        </p>

        <h2 className="max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          Building products, communities, and opportunities.
        </h2>

        <div className="mt-20 space-y-8">
          {experiences.map((item, index) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-[#B3001B]/30 md:p-10"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[color:var(--color-crimson-bright)]">
                      0{index + 1}
                    </span>
                    <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-[color:var(--color-crimson-bright)] md:text-4xl">
                      {item.company}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[color:var(--color-crimson-bright)]">
                    {item.role}
                  </p>
                </div>

                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  {item.period}
                </p>
              </div>

              <p className="mt-8 max-w-4xl text-lg leading-relaxed text-zinc-400">
                {item.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {item.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
