"use client";
import { useEffect } from "react";
import Lenis from "lenis";
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.9 });
    let id = requestAnimationFrame(function raf(t){ lenis.raf(t); id = requestAnimationFrame(raf); });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
