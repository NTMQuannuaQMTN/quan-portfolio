"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "../data/content";
import Particles from "./effects/Particles";
import GridBackground from "./effects/GridBackground";
import MagneticButton from "./effects/MagneticButton";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="absolute inset-0 bg-[#050505]" />

      <GridBackground />
      <Particles count={45} />

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B3001B]/20 blur-[180px]" />
      <div className="absolute left-1/2 top-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#B3001B]/10 blur-[120px]" />

      {/* Huge background typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center gap-0 mix-blend-overlay"
      >
        {profile.nameLines.map((line, index) => (
          <span
            key={line + index}
            className="whitespace-nowrap text-[16vw] font-black leading-[0.85] tracking-tighter text-white/40 md:text-[13vw]"
          >
            {line}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B3001B]/25 blur-[90px]" />
          <Image
            src="/images/profile-dark.png"
            alt={profile.name}
            width={750}
            height={922}
            priority
            className="relative h-[280px] w-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] md:h-[400px] lg:h-[480px]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="-mt-6 text-[10px] uppercase tracking-[0.5em] text-[color:var(--color-crimson-bright)] md:text-xs"
        >
          {profile.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl"
        >
          {profile.role}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg"
        >
          {profile.heroSubline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex flex-col gap-4 sm:flex-row"
        >
          <MagneticButton
            href="#projects"
            className="rounded-full bg-[#B3001B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d4041f]"
          >
            View Projects
          </MagneticButton>

          <MagneticButton
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 font-medium text-white transition-colors hover:border-[#B3001B]/50"
          >
            Contact Me
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
