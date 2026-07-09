"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { skills } from "../data/content";
import TechIcon from "./icons/TechIcons";

export default function Skills() {
  const [openCategory, setOpenCategory] = useState<string | null>(
    skills[0]?.category ?? null
  );

  return (
    <section id="skills" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Skills
        </p>

        <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          An ecosystem of technologies I build with.
        </h2>

        <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
          {skills.map((group) => {
            const isOpen = openCategory === group.category;

            return (
              <div key={group.category}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(isOpen ? null : group.category)
                  }
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-xl font-semibold text-white md:text-2xl">
                    {group.category}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-zinc-500"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-4 pb-8 pt-1">
                        {group.skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-300 transition-colors hover:-translate-y-1 hover:border-[#B3001B]/40"
                          >
                            <TechIcon
                              name={skill.icon}
                              className="h-4 w-4 text-[color:var(--color-crimson-bright)]"
                            />
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
