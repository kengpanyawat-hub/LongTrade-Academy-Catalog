import { defineField, defineType } from "sanity";

export default defineType({
  name: "goldflow",
  title: "Goldflow Page",
  type: "document",
  fields: [
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "title", title: "Title", type: "string", initialValue: "GOLDFLOW SYSTEM" }),
    defineField({ name: "intro", title: "Intro", type: "text" }),

    defineField({
      name: "devices",
      title: "Device Images (3)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "functions",
      title: "Functions Images (2–4)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "performance",
      title: "Performance Images (2–4)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "showcase", title: "Showcase Image", type: "image", options: { hotspot: true } }),
  ],
});
