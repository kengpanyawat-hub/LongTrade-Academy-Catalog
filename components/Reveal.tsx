// components/Reveal.tsx
"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const ctr = useAnimation();
  useEffect(() => { if (inView) ctr.start({ y: 0, opacity: 1 }); }, [inView, ctr]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={ctr}
      transition={{ duration: .5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
