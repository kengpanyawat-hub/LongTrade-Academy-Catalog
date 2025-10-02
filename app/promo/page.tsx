// app/promo/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { XMClaimButton, XMClaimModal } from "@/components/Modals";

// เดิมเคยดึงจาก CMS – ตอนนี้ถอดออกแล้ว ให้คืนค่าว่างไว้เป็น placeholder
async function loadPromosFromCMS(): Promise<{ xm: Promo[]; lt: Promo[] }> {
  return { xm: [], lt: [] };
}

export const metadata: Metadata = {
  title: "โปรโมชั่น | Longtrade Academy",
  description:
    "รวมดีลพิเศษ คูปอง และโปรโมชันจาก Longtrade Academy — อัปเดตล่าสุด",
};

type Promo = { title: string; desc: string; img: string };

const xmPromos: Promo[] = [
  {
    title: "เปิดบัญชีเทรดครั้งแรก รับ $30",
    desc:
      "เริ่มต้นเส้นทางการเทรดกับ XM ได้ทันทีด้วยโบนัสต้อนรับ $30 โดยไม่ต้องฝากเงิน เพียงเปิดบัญชีและยืนยันตัวตน ก็สามารถรับเครดิตเข้าเทรดจริงได้ทันที ช่วยให้คุณทดลองระบบ สัมผัสประสบการณ์ตลาด และสร้างโอกาสทำกำไรโดยไม่ต้องใช้เงินทุนตัวเอง",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(1).jpg",
  },
  {
    title: "โบนัสเงินฝาก 100%",
    desc:
      "เพิ่มพลังการเทรดของคุณด้วยโบนัสเงินฝาก 100% จาก XM รับเครดิตพิเศษสูงถึง $500 เพียงฝากเงินเข้าบัญชี ระบบจะเพิ่มโบนัสให้เท่ากับจำนวนเงินฝากทันที ช่วยขยายขนาดพอร์ตและเพิ่มโอกาสทำกำไรได้มากขึ้น",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(2).jpg",
  },
  {
    title: "โบนัสเงินฝาก 50%",
    desc:
      "รับโบนัสเงินฝาก 50% จาก XM สูงสุดถึง $2,000 ยิ่งฝากมาก ยิ่งได้เครดิตเพิ่มทันที ช่วยเสริมพลังการเทรดให้คุณมีเงินทุนมากขึ้น พร้อมสร้างโอกาสทำกำไรได้อย่างมั่นใจ",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(3).jpg",
  },
  {
    title: "โบนัสเงินฝาก 20%",
    desc:
      "ฝากเงินกับ XM วันนี้ รับโบนัสเพิ่มทันที 20% สูงสุดถึง $8,000 ขยายเงินทุนให้ใหญ่ขึ้น สร้างโอกาสทำกำไรได้มากกว่าเดิม",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(4).jpg",
  },
  {
    title: "แข่งเทรดบัญชีทดลอง ลุ้นรางวัลรวม $25,000",
    desc:
      "เข้าร่วมการแข่งขันบัญชีทดลองของ XM ลุ้นรับรางวัลรวมมูลค่า $25,000 ฝึกฝนทักษะในสภาพแวดล้อมเสมือนจริง โดยไม่ต้องใช้เงินทุนของตัวเอง แข่งขันอย่างมั่นใจ และพิสูจน์ความสามารถเพื่อคว้ารางวัลใหญ่",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(5).jpg",
  },
];

const ltSpecials: Promo[] = [
  {
    title: "GOLD FLOW SYSTEM (Indicators)",
    desc:
      "ฝากเงินเข้าบัญชีเทรด XM ขั้นต่ำ 500 USD รับฟรีทันที GoldFlow System เครื่องมือช่วยเทรดอัจฉริยะ สัญญาณ Buy/Sell พร้อมกำหนด TP–SL ใช้งานได้ทั้งมือถือและคอมพิวเตอร์ (เฉพาะสมาชิก Longtrade Academy)",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(6).jpg",
  },
  {
    title: "VIP SIGNAL (GOLD)",
    desc:
      "ฝากขั้นต่ำ 300 USD รับสิทธิ์เข้าห้อง VIP Gold Signal ทันที พร้อมสัญญาณซื้อขายทองคำ (Buy/Sell) แบบเรียลไทม์ วิเคราะห์ชัดเจน กำหนด TP–SL ครบถ้วน (เฉพาะสมาชิก Longtrade Academy)",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(7).jpg",
  },
  {
    title: "ลำโพงพรีเมียม JBL GO3",
    desc:
      "ฝากขั้นต่ำ 300 USD และมียอดเทรดครบ 1 Lot รับฟรีลำโพง JBL GO3 โปรสุดคุ้มที่ให้ทั้งโอกาสทำกำไร และของขวัญกลับไปในคราวเดียว (เฉพาะสมาชิก Longtrade Academy)",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(8).jpg",
  },
  {
    title: "E-BOOK (ภาษาไทย) – เล่มหลัก",
    desc:
      "ฝากขั้นต่ำ 100 USD และมียอดเทรดครบ 1 Lot รับฟรี E-BOOK พิเศษ มูลค่า 1,190 บาท ครอบคลุมกลยุทธ์ Day Trade, Supply & Demand และเส้นทางสร้างรายได้จากการเทรดรายวัน",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(9).jpg",
  },
  {
    title: "E-BOOK (ภาษาไทย) – รวมเทคนิค",
    desc:
      "อีกหนึ่ง E-BOOK ยอดนิยม มูลค่า 1,190 บาท สำหรับผู้ที่ต้องการต่อยอดทักษะการเทรด เพิ่มวินัย และโครงสร้างการวางแผนที่ชัดเจน",
    img: "https://ik.imagekit.io/pcqgvgpgi1/promo_%20(10).jpg",
  },
];

// 🔧 ทำให้หน้าเป็น async เพื่อใช้ await ได้
export default async function PromoPage() {
  // ปัจจุบัน CMS ไม่ใช้แล้ว — ฟังก์ชันจะคืนค่าว่าง และเราจะ fallback มาที่ LOCAL data
  const { xm, lt } = await loadPromosFromCMS().catch(() => ({ xm: [], lt: [] }));
  const xmPromosData = xm.length ? xm : xmPromos;
  const ltSpecialsData = lt.length ? lt : ltSpecials;

  const EP =
    "https://script.google.com/macros/s/AKfycbypTGXNeJaTpmoBlcEZTodJoWveZMirQJ-BhkbS_-HQeH89rwMekB2xDuHOh0S36KpL-A/exec";

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 md:pt-32 pb-16 space-y-10">
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold">โปรโมชั่นโบรก XM</h1>
            <p className="mt-3 text-white/80">
              อัปเดตดีลพิเศษ/คูปองประจำเดือน สำหรับอินดิเคเตอร์ คอร์ส และ eBook
            </p>
            <div className="mt-6 grid gap-4">
              {xmPromosData.map((p, i) => (
                <PromoBlock key={i} data={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold">สิทธิพิเศษ Longtrade</h1>
            <p className="mt-3 text-white/80">สำหรับสมาชิกที่ทำตามเงื่อนไขกับพาร์ทเนอร์</p>
            <div className="mt-6 grid gap-4">
              {ltSpecialsData.map((p, i) => (
                <PromoBlock key={i} data={p} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <div id="xm-claim" className="xm-modal">
        <div className="xm-sheet">
          <h3 className="text-xl md:text-2xl font-bold">รับสิทธิ์ฟรีสำหรับสมาชิก XM</h3>
          <p className="mt-2 text-white/80">กรอกข้อมูลเพื่อให้ทีมงานตรวจสอบสิทธิ์และติดต่อกลับ</p>

          <form id="xmForm" className="mt-4 space-y-3">
            <input name="name" type="text" required placeholder="ชื่อ-นามสกุล" className="xm-input" />
            <input name="email" type="email" required placeholder="อีเมลของคุณ" className="xm-input" />
            <input
              name="account"
              type="text"
              inputMode="numeric"
              placeholder="เลขพอร์ต/บัญชีเทรด (ถ้ามี)"
              className="xm-input"
            />
            <input name="phone" type="tel" placeholder="เบอร์โทรสำหรับติดต่อกลับ" className="xm-input" />
            <input id="xmSource" name="source" type="hidden" value="" />
            <div className="flex items-center gap-2">
              <button type="submit" className="btn-red">รับโค้ดสิทธิ์ใช้งาน</button>
              <a href="#" className="btn-ghost">ปิด</a>
            </div>
            <div className="text-xs text-white/60">* เงื่อนไขเป็นไปตามที่บริษัทกำหนด</div>
          </form>
        </div>
      </div>

      {/* Toast */}
      <div id="xmToast" className="xm-toast" />

      <style>{`
        .promo-card{display:grid;grid-template-columns:96px 1fr;gap:16px}
        @media(min-width:640px){.promo-card{grid-template-columns:120px 1fr}}
        .promo-img{position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden}
        .btn-red{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.25rem;border-radius:9999px;background:#e11d48;color:#fff;font-weight:600;box-shadow:0 8px 28px rgba(244,63,94,.35);transition:background .2s ease}
        .btn-red:hover{background:#f43f5e}
        .btn-ghost{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.1rem;border-radius:9999px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18)}
        .xm-modal{position:fixed;inset:0;display:none;place-items:center;background:rgba(0,0,0,.6);z-index:70;padding:1rem;backdrop-filter:saturate(160%) blur(4px)}
        .xm-modal:target{display:grid}
        .xm-sheet{width:min(560px,92vw);background:radial-gradient(120% 120% at 100% 0%, rgba(225,29,72,.12), transparent 60%),rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.35);border-radius:1rem;padding:1.25rem;position:relative}
        .xm-input{width:100%;border-radius:.75rem;padding:.9rem 1rem;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.16);color:#fff;outline:none}
        .xm-input::placeholder{color:rgba(255,255,255,.55)}
        .xm-toast{position:fixed;right:16px;bottom:16px;z-index:80;min-width:240px;max-width:360px;display:none;background:rgba(20,20,20,.95);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.4)}
        .xm-toast.show{display:block;animation:fadein .2s ease}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var EP = ${JSON.stringify(
    "https://script.google.com/macros/s/AKfycbypTGXNeJaTpmoBlcEZTodJoWveZMirQJ-BhkbS_-HQeH89rwMekB2xDuHOh0S36KpL-A/exec"
  )};
  function toast(msg){
    var el = document.getElementById('xmToast');
    if(!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  // ใส่ source (หัวข้อโปรโมชัน) ตอนกดปุ่มเปิดฟอร์ม
  document.addEventListener('click', function(e){
    var t = e.target;
    if(!(t instanceof Element)) return;
    var btn = t.closest('[data-xm-open]');
    if(!btn) return;
    var src = btn.getAttribute('data-xm-open') || '';
    var input = document.getElementById('xmSource');
    if(input) input.value = src;
  }, true);

  // ส่งเข้า Google Sheet แบบ no-cors + แจ้ง Telegram แบบ fire-and-forget
  var form = document.getElementById('xmForm');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var fd = new FormData(form);
      var payload = {
        name:   fd.get('name')   || '',
        email:  fd.get('email')  || '',
        account:fd.get('account')|| '',
        phone:  fd.get('phone')  || '',
        page: 'promo',
        source: fd.get('source') || '',
        ua: navigator.userAgent
      };
      if(!EP){ toast('Endpoint ไม่ถูกตั้งค่า'); return; }

      fetch(EP, { method:'POST', mode:'no-cors', body: JSON.stringify(payload) })
      .then(function(){
        toast('ส่งคำขอแล้ว');
        try {
          fetch('/api/notify/telegram', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              text: [
                '📩 <b>XM Lead ใหม่</b>',
                'ชื่อ: ' + (payload.name||'-'),
                'อีเมล: ' + (payload.email||'-'),
                'พอร์ต: ' + (payload.account||'-'),
                'โทร: ' + (payload.phone||'-'),
                'เพจ: ' + (payload.page||'-'),
                'ที่มา: ' + (payload.source||'-')
              ].join('\\n')
            })
          });
        } catch(e) {}
        if (location.hash === '#xm-claim') history.replaceState(null, '', ' ');
        form.reset();
      })
      .catch(function(){ toast('ส่งไม่สำเร็จ'); });
    });
  }
})();`,
        }}
      />
    </>
  );
}

function PromoBlock({ data }: { data: Promo }) {
  return (
    <div className="glass p-5 rounded-2xl border border-white/10">
      <div className="promo-card">
        <div className="promo-img border border-white/10">
          <Image src={data.img} alt={data.title} fill className="object-cover" />
        </div>
        <div>
          <div className="text-lg font-semibold">{data.title}</div>
          <div className="opacity-80 mt-1">{data.desc}</div>
          <div className="mt-4 flex gap-2">
            <a href="#xm-claim" className="btn-red" data-xm-open={data.title}>
              รับสิทธิสำหรับสมาชิก XM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
