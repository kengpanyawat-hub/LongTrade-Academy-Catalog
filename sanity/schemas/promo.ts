import { defineField, defineType } from "sanity";

export default defineType({
  name: "promo",
  title: "Promo",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: r => r.required() }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    // tag เพื่อแยกหมวดหมู่ เช่น "xm" | "lt"
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: { list: ["xm", "lt"] },
      initialValue: "xm",
    }),
    // สำหรับปุ่มบนเว็บ (optional)
    defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
  ],
});
