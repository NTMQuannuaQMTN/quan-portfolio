export default function Navbar() {
    const navItems = [
        "journey",
        "skills",
        "experience",
        "projects",
        "education",
        "blog",
    ];

    return (
        <>
            <nav
                className="
            fixed top-0 left-0 right-0
            z-50
            border-b border-white/10
            bg-black/70
            backdrop-blur-xl
          "
            >
                <div
                    className="
              mx-auto
              flex
              h-16
              max-w-7xl
              items-center
              justify-between
              px-6
              lg:px-10
            "
                >
                    <a
                        href="#"
                        className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.25em]
                text-white
              "
                    >
                        Nguyễn Trương Mạnh Quân
                    </a>

                    <div className="hidden items-center gap-8 lg:flex">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                className="
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-zinc-400
                    transition
                    hover:text-red-500
                  "
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            <div
                className="
            fixed
            bottom-5
            left-1/2
            z-50
            flex
            -translate-x-1/2
            gap-5
            rounded-full
            border
            border-white/10
            bg-black/80
            px-5
            py-3
            backdrop-blur-xl
            lg:hidden
          "
            >
                {navItems.map((item) => (
                    <a
                        key={item}
                        href={`#${item}`}
                        className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-zinc-400
              "
                    >
                        {item}
                    </a>
                ))}
            </div>
        </>
    );
}