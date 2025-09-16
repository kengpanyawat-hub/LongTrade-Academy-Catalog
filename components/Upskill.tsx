// components/Upskill.tsx
"use client";
import Image from "next/image";
import { upskill } from "@/data/upskill";
import { Check } from "lucide-react";

export default function Upskill() {
  return (
    <section className="container-narrow py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-2">ยกระดับสกิลเทรด</h2>
        <p className="text-base md:text-lg opacity-80 mx-auto max-w-2xl">
          ค่อย ๆ ต่อยอดจากพื้นฐานสู่การเทรดที่มีระบบและวินัย
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {upskill.map((b, i) => (
          <div key={i} className="glass overflow-hidden reveal">
            <div className="relative w-full h-48">
              <Image src={b.image} alt={b.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg">{b.title}</h3>
              <p className="opacity-80 text-sm mt-1">{b.text}</p>
              <ul className="mt-3 space-y-2 text-sm opacity-90">
                {b.bullets.map((t, k) => (
                  <li key={k} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
