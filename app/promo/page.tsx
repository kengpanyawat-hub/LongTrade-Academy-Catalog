// app/promo/page.tsx
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client"; // ใช้ client กลางที่กำหนด ENV ไว้แล้ว

// ---- GROQ (ดึงรายการโปรโม/แบนเนอร์) ----
const promosQuery = groq`*[_type == "promo"] | order(_createdAt desc){
  _id,
  title,
  description,
  "cover": cover.asset->url,
  ctaText,
  ctaHref
}`;

export default async function PromoPage() {
  // ดึงข้อมูลจาก Sanity (ไม่มี API token ก็อ่าน published ได้)
  const promos: Array<{
    _id: string;
    title?: string;
    description?: string;
    cover?: string;
    ctaText?: string;
    ctaHref?: string;
  }> = await client.fetch(promosQuery).catch(() => []);

  return (
    <>
      <Navbar />
      <main className="container-narrow py-12">
        <h1 className="text-3xl font-extrabold mb-6">Promo</h1>

        {promos.length === 0 ? (
          <p className="text-white/70">ยังไม่มีข้อมูลโปรโมชัน</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promos.map((p) => (
              <article
                key={p._id}
                className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10"
              >
                {p.cover && (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={p.cover}
                      alt={p.title || "promo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{p.title || "Untitled"}</h3>
                  {p.description && (
                    <p className="mt-2 text-white/70">{p.description}</p>
                  )}
                  {p.ctaHref && (
                    <a
                      href={p.ctaHref}
                      className="inline-flex mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15"
                    >
                      {p.ctaText || "ดูรายละเอียด"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
