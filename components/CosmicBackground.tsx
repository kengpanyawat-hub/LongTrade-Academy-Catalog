// components/CosmicBackground.tsx
"use client";

import clsx from "clsx";
import { PropsWithChildren, useMemo } from "react";

type Props = PropsWithChildren<{
  className?: string;
  particles?: number; // default 18
}>;

export default function CosmicBackground({ className, particles = 20, children }: Props) {
  const points = useMemo(() => Array.from({ length: particles }), [particles]);

  return (
    <section className={clsx("cosmic-bg rounded-3xl border border-white/10", className)}>
      {/* particles */}
      {points.map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${9 + Math.random() * 6}s`,
            animationDelay: `${-Math.random() * 8}s`,
          }}
        />
      ))}
      {/* content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
