'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

// Thin brand-gradient bar pinned to the top of the viewport showing page scroll progress.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-linear-to-r from-[#36135d] via-[#a7144c] to-[#f59e0b]"
      style={{ scaleX }}
    />
  );
}
