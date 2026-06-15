export default function Philosophy() {
    return (
      <section
        className="
          relative
          overflow-hidden
          px-6
          py-24
          lg:px-10
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-900/10
            blur-[120px]
          "
        />
  
        <div className="relative mx-auto max-w-5xl text-center">
          <p
            className="
              mb-6
              text-xs
              uppercase
              tracking-[0.4em]
              text-red-500
            "
          >
            Philosophy
          </p>
  
          <h2
            className="
              text-4xl
              font-semibold
              leading-[1.15]
              tracking-[-0.04em]
              text-white
              md:text-6xl
            "
          >
            Technology should create opportunities,
            <br />
            not barriers.
          </h2>
  
          <p
            className="
              mx-auto
              mt-10
              max-w-3xl
              text-lg
              leading-relaxed
              text-zinc-400
            "
          >
            Through software, education, and community building,
            I create products that help people learn, connect,
            and grow. Whether teaching programming to students,
            building educational platforms, or launching startups,
            my goal is always the same: create meaningful impact.
          </p>
        </div>
      </section>
    );
  }