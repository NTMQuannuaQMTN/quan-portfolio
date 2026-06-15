import { motion } from "framer-motion";

export default function Blog({ blogs }: any) {
    console.log(blogs);

  return (
    <section
      id="blog"
      className="
        relative
        overflow-hidden
        px-6
        py-24
        lg:px-10
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-[600px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-red-900/10
          blur-[180px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <p
            className="
              mb-6
              text-xs
              uppercase
              tracking-[0.4em]
              text-red-500
            "
          >
            Writing
          </p>

          <h2
            className="
              max-w-5xl
              text-4xl
              font-semibold
              leading-[1.1]
              tracking-[-0.04em]
              text-white
              md:text-6xl
            "
          >
            Thoughts on technology,
            <br />
            education, startups,
            <br />
            and personal growth.
          </h2>

          <p
            className="
              mt-8
              max-w-2xl
              text-lg
              leading-relaxed
              text-zinc-400
            "
          >
            Lessons, ideas, experiences, and reflections collected
            throughout my journey as a builder, founder, educator,
            and Computer Science student.
          </p>
        </motion.div>

        {/* Blog Posts */}

        <div className="mt-20 space-y-10">
          {blogs?.map((post: any, index: number) => (
            <motion.a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                group
                block
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.02]
                transition
                duration-300
                hover:border-red-500/20
                hover:bg-white/[0.03]
              "
            >
              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                "
              >

                {/* Content */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    justify-between
                    p-8
                    lg:p-10
                  "
                >
                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        text-xs
                        uppercase
                        tracking-[0.25em]
                      "
                    >
                      <span className="text-red-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-zinc-500">
                        {new Date(
                          post.published
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3
                      className="
                        mt-6
                        text-2xl
                        font-semibold
                        leading-tight
                        tracking-[-0.03em]
                        text-white
                        transition
                        group-hover:text-red-400
                        md:text-4xl
                      "
                    >
                      {post.title}
                    </h3>
                  </div>

                  <div className="mt-10">
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-3
                        text-sm
                        uppercase
                        tracking-[0.25em]
                        text-zinc-400
                        transition
                        group-hover:text-red-400
                      "
                    >
                      Read Article
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Empty State */}

        {(!blogs || blogs.length === 0) && (
          <div
            className="
              mt-20
              rounded-[2rem]
              border
              border-white/10
              bg-white/[0.02]
              p-12
              text-center
            "
          >
            <h3 className="text-2xl font-semibold text-white">
              Coming Soon
            </h3>

            <p className="mt-4 text-zinc-400">
              New articles and thoughts will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}