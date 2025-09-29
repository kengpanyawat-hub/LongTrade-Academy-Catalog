// app/indicators/boost-capital/head.tsx
export default function Head() {
  const title = "BOOST CAPITAL I Indicator | Longtrade Academy";
  const description =
    "อินดิเคเตอร์แนว Trend-Follow/Breakout สำหรับการขยายทุนอย่างมีวินัย พร้อมสัญญาณเข้าเทรด โซน TP/SL และวางแผนแบ่งไม้";
  const url = "https://longtrade-academy.com/indicators/boost-capital";
  const ogImage = "https://ik.imagekit.io/pcqgvgpgi1/og-longtrade.jpg";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
