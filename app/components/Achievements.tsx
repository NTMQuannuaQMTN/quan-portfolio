"use client";

import { motion } from "framer-motion";
import { achievements } from "../data/content";

export default function Achievements() {
  return (
    <section id="achievements" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Achievements
        </p>

        <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          Recognition, leadership, and impact.
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {achievements.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-[#B3001B]/30"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-crimson-bright)]">
                {item.category}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
