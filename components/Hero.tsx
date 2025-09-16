"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { content } from "@/data/content";
export default function Hero() {
  return (
    <header className="relative min-h-[80svh] flex items-center justify-center text-center">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="relative z-10 glass max-w-3xl mx-4 p-8 md:p-12">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3">{content.hero.headline}</h1>
        <p className="text-base md:text-xl opacity-80 mb-8">เครื่องมือ, Ebook, EA, คอร์สเรียน และบทความที่คัดสรรมาเพื่อคุณ</p>
        <Link href="#catalog" className="inline-block bg-brand text-white px-6 py-3 rounded-full a11y-focus">{content.hero.cta_text}</Link>
      </motion.div>
    </header>
  );
}
