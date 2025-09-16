"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Background() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
    }, { threshold: .15 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div aria-hidden className="bg-anim">
      {/* base image */}
      <Image src="/bg/red_glass.png" alt="" fill priority sizes="100vw" className="object-cover" />
      {/* subtle spark field */}
      <div className="sparkfield" />
      {/* rising bubbles */}
      <div className="bubble" style={{left:"7%",  bottom:"-10%", ["--dur" as any]:"26s"}} />
      <div className="bubble" style={{left:"28%", bottom:"-12%", ["--dur" as any]:"30s"}} />
      <div className="bubble" style={{left:"52%", bottom:"-14%", ["--dur" as any]:"24s"}} />
      <div className="bubble" style={{left:"74%", bottom:"-18%", ["--dur" as any]:"32s"}} />
	  <div className="bubble" style={{ left: "18%", bottom: "-16%", ["--dur" as any]:"34s", ["--delay" as any]:"-12s" }} />
	  <div className="bubble" style={{ left: "40%", bottom: "-20%", ["--dur" as any]:"28s" }} />
	  <div className="bubble" style={{ left: "63%", bottom: "-22%", ["--dur" as any]:"36s", ["--size" as any]:"200px" }} />
	  <div className="bubble" style={{ left: "86%", bottom: "-24%", ["--dur" as any]:"42s" }} />
      {/* vignette */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
