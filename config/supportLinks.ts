// config/supportLinks.ts
export const SUPPORT_LINKS = [
  { label: "Facebook", href: "https://facebook.com/longtradeacademy", kind: "fb" },
  { label: "Instagram", href: "https://instagram.com/longtradeacademy", kind: "ig" },
  { label: "YouTube", href: "https://youtube.com/@longtradeacademy", kind: "yt" },
  { label: "Website", href: "https://www.longtradeacademy.com", kind: "web" },
  { label: "LINE", href: "https://line.me/ti/p/~longtrade", kind: "line" },
] as const;

export type SupportLinkKind = typeof SUPPORT_LINKS[number]["kind"];
