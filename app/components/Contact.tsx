"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "../data/content";
import MagneticButton from "./effects/MagneticButton";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-crimson-bright)]">
          Contact
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl"
        >
          Let&apos;s talk about what you&apos;re building.
        </motion.h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-6">
              <a
                href={`mailto:${profile.email}`}
                className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
              >
                Email
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
              >
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-[color:var(--color-crimson-bright)]"
              >
                LinkedIn
              </a>
            </div>

            <MagneticButton
              href={profile.resumeUrl}
              className="mt-10 inline-flex rounded-full border border-white/15 px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors hover:border-[#B3001B]/50"
            >
              Download Resume
            </MagneticButton>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#B3001B]/50"
            />
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#B3001B]/50"
            />
            <textarea
              required
              rows={5}
              placeholder="Your message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#B3001B]/50"
            />
            <button
              type="submit"
              className="rounded-full bg-[#B3001B] px-8 py-4 font-medium text-white transition-colors hover:bg-[#d4041f]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
