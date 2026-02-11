"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";

const HeroBackground = () => {
  // Mouse position state for the gradient center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the gradient movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Create a reactive value for the background gradient
  // We use background-attachment: fixed so that the gradient coordinates (window-relative) align correctly with the text
  const background = useMotionTemplate`radial-gradient(
    circle 250px at ${springX}px ${springY}px, 
    var(--color-green-600) 0%, 
    var(--color-blue-500) 25%, 
    var(--color-green-900) 50%, 
    transparent 80%
  )`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center z-0 pointer-events-none">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Layer 1: Base Text (Dimmed/Stroke) */}
        <div className="absolute inset-0 flex items-center justify-center select-none">
          <span
            className="text-[45vw] font-black tracking-tighter text-transparent leading-none"
            style={{
              filter: "blur(0px)",
            }}
          >
            OVR
          </span>
        </div>

        {/* Layer 2: Highlight Text (Masked Gradient) */}
        <div className="absolute inset-0 flex items-center justify-center select-none mix-blend-screen">
          <motion.span
            className="text-[45vw] font-black tracking-tighter text-transparent leading-none"
            style={{
              backgroundImage: background,
              backgroundAttachment: "fixed",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            OVR
          </motion.span>
        </div>

        {/* Radial gradient overlay to fade edges */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-60" />
      </div>
    </div>
  );
};

export default HeroBackground;
