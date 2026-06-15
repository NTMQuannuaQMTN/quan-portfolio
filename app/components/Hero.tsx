import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
    return (
      <section
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          px-6
        "
      >
        {/* Background */}
  
        <div className="absolute inset-0 bg-[#050505]" />
  
        {/* Main Red Glow */}
  
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-700/20
            blur-[180px]
          "
        />
  
        {/* Secondary Glow */}
  
        <div
          className="
            absolute
            left-1/2
            top-[45%]
            h-[400px]
            w-[400px]
            -translate-x-1/2
            rounded-full
            bg-red-500/10
            blur-[120px]
          "
        />
  
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            max-w-5xl
            flex-col
            items-center
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >
            <img
              src="/images/profile.png"
              alt="Quan"
              className="
                h-[260px]
                w-[260px]
                rounded-full
                object-cover
                border
                border-white/10
                shadow-2xl
                md:h-[340px]
                md:w-[340px]
                lg:h-[420px]
                lg:w-[420px]
              "
            />
  
            <div
              className="
                absolute
                inset-0
                rounded-full
                ring-2
                ring-red-500/20
              "
            />
          </motion.div>
  
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              mt-10
              text-[10px]
              uppercase
              tracking-[0.5em]
              text-red-500
              md:text-xs
            "
          >
            Computer Science Student • Builder • Founder
          </motion.p>
  
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="
              mt-6
              max-w-5xl
              text-5xl
              font-black
              leading-none
              tracking-[-0.05em]
              text-white
              md:text-7xl
              lg:text-8xl
            "
          >
            NGUYỄN
            <br />
            TRƯƠNG MẠNH QUÂN
          </motion.h1>
  
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="
              mt-8
              max-w-2xl
              text-base
              leading-relaxed
              text-zinc-400
              md:text-lg
            "
          >
            Building products, communities, and educational
            technology that create meaningful impact through
            software and innovation.
          </motion.p>
  
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="
              mt-10
              flex
              flex-col
              gap-4
              sm:flex-row
            "
          >
            <a
              href="#projects"
              className="
                rounded-full
                bg-red-700
                px-8
                py-4
                font-medium
                text-white
                transition
                hover:bg-red-600
              "
            >
              View Projects
            </a>
  
            <a
              href="#blog"
              className="
                rounded-full
                border
                border-white/10
                px-8
                py-4
                font-medium
                text-white
                transition
                hover:border-red-500/40
              "
            >
              Read Blog
            </a>
          </motion.div>
        </div>
      </section>
    );
  }