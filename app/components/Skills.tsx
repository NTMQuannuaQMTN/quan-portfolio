"use client";

import { useState } from "react";
import Image from "next/image";
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
                      className="overflow-hidden -mt-4"
                    >
                      <div className="flex flex-wrap gap-5 pb-8 pt-12 px-4">
                        {group.skills.map((skill) => (
                          <div key={skill.name} className="group relative">
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-medium text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                              {skill.name}
                            </span>

                            <div className="relative h-16 w-16 rounded-2xl bg-white p-3 shadow-md transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(179,0,27,0.35)]">
                              {skill.logo ? (
                                <Image
                                  src={skill.logo}
                                  alt={skill.name}
                                  fill
                                  unoptimized
                                  sizes="64px"
                                  className="object-contain p-1"
                                />
                              ) : (
                                <TechIcon
                                  name={skill.icon}
                                  className="h-full w-full text-black"
                                />
                              )}
                            </div>
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
