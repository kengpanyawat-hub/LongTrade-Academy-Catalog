export type SupportLinkKind = "fb" | "ig" | "yt" | "web" | "line" | "promo";

export type SupportLink = {
  label: string;
  href: string;
  kind: SupportLinkKind;
  external?: boolean; // ถ้า true จะใส่ target="_blank"
};

export const SUPPORT_LINKS: SupportLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/longtradeacademy",
    kind: "fb",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/longtradeacademy",
    kind: "ig",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@longtradeacademy",
    kind: "yt",
    external: true,
  },
  {
    label: "Website",
    href: "https://www.longtradeacademy.com",
    kind: "web",
    external: true,
  },
  {
    label: "LINE",
    href: "https://line.me/ti/p/~longtrade",
    kind: "line",
    external: true,
  },
  {
    label: "Promotion",
    href: "/promo", // ลิงก์ภายใน
    kind: "promo",
    external: false,
  },
];
