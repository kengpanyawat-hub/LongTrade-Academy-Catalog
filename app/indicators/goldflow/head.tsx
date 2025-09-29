// app/indicators/goldflow/head.tsx
export default function Head() {
  const title = "GOLDFLOW Indicator | Longtrade Academy";
  const description =
    "อินดิเคเตอร์กลยุทธ์แนว MA Crossover/Trend-Follow แบบใช้งานง่าย พร้อมวิดีโอเดโม่ รีวิวผู้ใช้จริง และลิงก์ติดต่อ";
  const url = "https://longtrade-catalog.vercel.app/indicators/goldflow";
  const ogImage = "https://ik.imagekit.io/pcqgvgpgi1/og-longtrade.jpg";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
