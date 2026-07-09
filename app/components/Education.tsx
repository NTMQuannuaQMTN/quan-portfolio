"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { education } from "../data/content";

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Education
        </p>

        <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          The institutions that shaped my journey.
        </h2>

        <div className="mt-16 space-y-8">
          {education.map((school, index) => (
            <motion.div
              key={school.school}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:flex-row md:items-center"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
                <Image
                  src={school.logo}
                  alt={school.school}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--color-crimson-bright)]">
                  {school.period}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {school.school}
                </h3>
                <p className="mt-2 text-zinc-400">{school.degree}</p>
                <p className="mt-1 text-sm text-zinc-500">{school.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
