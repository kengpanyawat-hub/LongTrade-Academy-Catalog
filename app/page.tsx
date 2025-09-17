import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Hero from "@/components/Hero";
import SubHero from "@/components/SubHero";
import CatalogSection from "@/components/CatalogSection";
import Footer from "@/components/Footer";
import { catalog } from "@/data/catalog";
// app/page.tsx (ส่วน import)
import WhyUs from "@/components/WhyUs";
import Upskill from "@/components/Upskill";
// app/page.tsx (เฉพาะส่วนที่เพิ่ม)
import UseCases from "@/components/UseCases";

export default function Page() {
  return (
    <main>
      <Background />
      <Navbar />
      <Hero />
      <SubHero />
      <div id="catalog" className="container-narrow py-12">
        <CatalogSection title="อินดิเคเตอร์" items={catalog.indicators.slice(0,3)} href="/indicators" />
        <CatalogSection title="Ebook" items={catalog.ebooks.slice(0,3)} href="/ebooks" imageAspect="tall"/>
        <CatalogSection title="EA (Expert Advisor)" items={catalog.ea.slice(0,3)} href="/ea" />
        <CatalogSection title="คอร์สเรียน" items={catalog.courses.slice(0,3)} href="/courses" />
        <CatalogSection title="บทความ" items={catalog.articles.slice(0,3)} href="/articles" />
      </div>
	  <WhyUs />
	  <Upskill />
	  <UseCases />   {/* << เพิ่มส่วน Use-cases / Playbook */}

	  <div id="catalog" className="container-narrow py-12">
	    {/* CatalogSection ... */}
	  </div>
      <Footer />
    </main>
  );
}
