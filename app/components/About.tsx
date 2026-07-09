"use client";

import { motion } from "framer-motion";
import { profile, stats } from "../data/content";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          About
        </p>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-6xl"
          >
            {profile.statement}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
              {profile.story}
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-white/10 pl-4"
                >
                  <div className="text-3xl font-semibold text-white md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
