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
import RedCta from "@/components/RedCta";
import PromoSplit from "@/components/PromoSplit";
import PromoVideo from "@/components/PromoVideo";

export default function Page() {
  return (
    <main>
      <Background />
      <Navbar />
      <Hero />
	  <PromoVideo />
      <SubHero />
      <div id="catalog" className="container-narrow py-12">
        <CatalogSection title="อินดิเคเตอร์" items={catalog.indicators.slice(0,3)} href="/indicators" />
        <CatalogSection title="Ebook" items={catalog.ebooks.slice(0,3)} href="/ebooks" />
        <CatalogSection title="EA (Expert Advisor)" items={catalog.ea.slice(0,3)} href="/ea" />
        <CatalogSection title="คอร์สเรียน" items={catalog.courses.slice(0,3)} href="/courses" />
        <CatalogSection title="บทความ" items={catalog.articles.slice(0,3)} href="/articles" />
      </div>
	  <PromoSplit
        title="เทรดแบบไม่ต้องเครียด"
        p1="เปิดกราฟแล้วรู้ทันทีว่าต้องทำอะไร"
        p2="เครื่องมือของเราให้ทั้งโครงสร้างและสัญญาณที่ชัดเจน"
        p3={<>วันนี้รับ <span className="text-rose-400 font-semibold">ส่วนลด 25%</span> เริ่มควบคุมอนาคตการเทรดของคุณ</>}
        ctaText="เริ่มใช้งานเลย"
        href="https://line.me/ti/p/~longtrade"
        image="https://ik.imagekit.io/pcqgvgpgi1/bg%20graph.jpg"
        alt="Background trading graph"
      />
	  <RedCta
        title="เข้าร่วมกับ"
        highlight="10,000+ เทรดเดอร์"
        subtitle="อัปเกรดสกิลการเทรดของคุณด้วยเครื่องมือและความรู้คัดสรร"
        buttonText="ติดต่อเพื่อรับข้อเสนอ"
        href="https://line.me/ti/p/~longtrade" // เปลี่ยนเป็นลิงก์ที่คุณต้องการ
      />
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
