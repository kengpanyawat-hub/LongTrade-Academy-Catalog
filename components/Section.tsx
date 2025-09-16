import Link from "next/link";
export default function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      <Link href={href} className="text-brand hover:underline flex items-center gap-1">
        ดูทั้งหมด <span aria-hidden>›</span>
      </Link>
    </div>
  );
}
