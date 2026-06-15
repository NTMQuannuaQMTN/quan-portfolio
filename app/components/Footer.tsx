export default function Footer() {
    return (
        <footer
            className="
          border-t
          border-white/10
          px-6
          py-16
          lg:px-10
        "
        >
            <div className="mx-auto max-w-7xl">
                <h2
                    className="
              text-3xl
              font-bold
              text-white
              md:text-5xl
            "
                >
                    Nguyễn Trương Mạnh Quân
                </h2>

                <p className="mt-4 text-zinc-400">
                    Computer Science Student @ NUS
                </p>

                <div className="mt-10 flex flex-wrap gap-6">
                    <a
                        href="https://www.linkedin.com/in/nguyen-truong-manh-quan/"
                        className="text-zinc-400 hover:text-red-500"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="https://github.com/NTMQuannuaQMTN"
                        className="text-zinc-400 hover:text-red-500"
                    >
                        GitHub
                    </a>

                    <a
                        href="nguyentruongmanhquan@email.com"
                        className="text-zinc-400 hover:text-red-500"
                    >
                        Email
                    </a>
                </div>

                <div className="mt-12 text-sm text-zinc-600">
                    © 2026 Nguyễn Trương Mạnh Quân
                </div>
            </div>
        </footer>
    );
}