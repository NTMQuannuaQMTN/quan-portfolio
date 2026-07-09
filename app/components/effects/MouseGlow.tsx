"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseGlow({
  className = "",
  size = 480,
  color = "rgba(179, 0, 27, 0.18)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      x.set(event.clientX - bounds.left - size / 2);
      y.set(event.clientY - bounds.top - size / 2);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [size, x, y]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: size,
          height: size,
          background: color,
          x: springX,
          y: springY,
        }}
      />
    </div>
  );
}
