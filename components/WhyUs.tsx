// components/WhyUs.tsx
"use client";
import { whyus } from "@/data/whyus";
import {
  ShieldCheck, Timer, Sparkles, LineChart, Users, Undo2
} from "lucide-react";

const iconMap = { ShieldCheck, Timer, Sparkles, LineChart, Users, Undo2 };

export default function WhyUs() {
  return (
    <section className="container-narrow py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-2">ทำไมต้อง Longtrade?</h2>
        <p className="text-base md:text-lg opacity-80 mx-auto max-w-2xl">
          เพราะเราอยากให้คุณเทรดได้ดีขึ้นอย่างยั่งยืน ทั้งเครื่องมือและองค์ความรู้
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {whyus.map((f) => {
          const Icon = iconMap[f.icon];
          return (
            <div key={f.key} className="glass p-5 reveal">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 border border-white/10">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="opacity-80 text-sm mt-1">{f.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
