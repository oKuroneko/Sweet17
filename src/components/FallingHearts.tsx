import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Heart {
  id: number;
  x: number; // percentage left (0 to 100)
  size: number; // pixels (12 to 32)
  duration: number; // seconds (4 to 8)
  delay: number; // seconds
  opacity: number;
  rotation: number;
}

export default function FallingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Pre-populate some hearts
    const initialHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 12,
      duration: Math.random() * 4 + 5,
      delay: Math.random() * -5, // negative delay so they start at different vertical heights
      opacity: Math.random() * 0.4 + 0.3,
      rotation: Math.random() * 360,
    }));
    setHearts(initialHearts);

    let counter = 15;
    const interval = setInterval(() => {
      setHearts((prev) => {
        // Limit active hearts to avoid performance issues
        const filtered = prev.filter((h) => h.delay + h.duration > -10); // Keep them a bit
        if (filtered.length < 35) {
          const newHeart: Heart = {
            id: counter++,
            x: Math.random() * 100,
            size: Math.random() * 20 + 12,
            duration: Math.random() * 5 + 6,
            delay: 0,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 360,
          };
          return [...filtered, newHeart];
        }
        return filtered;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" id="falling-hearts-container">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "-10vh", x: `${heart.x}vw`, opacity: 0, rotate: heart.rotation }}
            animate={{
              y: "110vh",
              x: [
                `${heart.x}vw`,
                `${heart.x + (Math.random() * 10 - 5)}vw`,
                `${heart.x + (Math.random() * 16 - 8)}vw`,
              ],
              opacity: [0, heart.opacity, heart.opacity, 0],
              rotate: heart.rotation + 360,
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute text-pink-300"
            style={{
              width: heart.size,
              height: heart.size,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full drop-shadow-sm filter blur-[0.3px]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
