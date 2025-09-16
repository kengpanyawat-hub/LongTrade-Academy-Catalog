// components/UseCases.tsx
"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { usecases, type UseCase } from "@/data/usecases";
import UseCaseModal from "./UseCaseModal";

const cats = ["All","Trend","Breakout","Range","News"] as const;
type Cat = (typeof cats)[number];

export default function UseCases() {
  const [cat, setCat] = useState<Cat>("All");
  const [open, setOpen] = useState<UseCase | null>(null);

  const items = useMemo(
    () => usecases.filter(u => cat==="All" ? true : u.category===cat),
    [cat]
  );

  return (
    <section className="container-narrow py-12 md:py-16">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-2">Use-cases / Playbook</h2>
        <p className="opacity-80 max-w-2xl mx-auto">
          ตัวอย่างสถานการณ์จริงพร้อมขั้นตอนปฏิบัติ นำไปใช้ได้ทันที
        </p>
      </div>

      {/* Chips filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {cats.map(c => (
          <button key={c} onClick={()=>setCat(c)}
            className={`pill ${cat===c?"active":""}`}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(u => (
          <button key={u.id} className="card text-left reveal" onClick={()=>setOpen(u)}>
            <div className="card-img">
              <Image src={u.image} alt={u.title} fill />
              <div className="card-gradient" />
            </div>
            <div className="card-body">
              <div className="text-sm opacity-75 mb-1">{u.category}</div>
              <div className="card-title">{u.title}</div>
              <p className="card-summary">{u.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {u.tools.slice(0,2).map(t => <span key={t} className="pill">{t}</span>)}
              </div>
            </div>
          </button>
        ))}
      </div>

      <UseCaseModal item={open} onClose={()=>setOpen(null)} />
    </section>
  );
}
