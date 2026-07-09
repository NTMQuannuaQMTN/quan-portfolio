"use client";

import { motion } from "framer-motion";
import { journey } from "../data/content";

export default function Journey() {
  return (
    <section id="journey" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Journey
        </p>

        <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          The journey that shaped who I am today.
        </h2>

        <div className="mt-20">
          {journey.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative flex gap-8 pb-16"
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="h-4 w-4 shrink-0 rounded-full bg-[#B3001B]"
                />
                {index !== journey.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/10" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-crimson-bright)]">
                  {item.year}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">
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
