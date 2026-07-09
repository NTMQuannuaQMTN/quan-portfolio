"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const handlePointerMove = (
    event: React.PointerEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = event.clientX - bounds.left - bounds.width / 2;
    const relY = event.clientY - bounds.top - bounds.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    style: { x: springX, y: springY },
    className,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...sharedProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...sharedProps}
    >
      {children}
    </motion.button>
  );
}
