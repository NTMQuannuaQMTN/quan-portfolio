"use client";

import { motion } from "framer-motion";

export default function Blog() {
  return (
    <section id="blog" className="relative overflow-hidden px-6 py-24 lg:px-10">
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#B3001B]/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
            Writing
          </p>

          <h2 className="max-w-5xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
            Thoughts on technology, education, startups, and personal growth.
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Lessons, ideas, experiences, and reflections collected throughout
            my journey as a builder, founder, educator, and Computer Science
            student.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.02] p-12 text-center"
        >
          <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
          <p className="mt-4 text-zinc-400">
            New articles and thoughts will appear here.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
