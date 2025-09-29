// sanity/schemas/goldFlow.ts
import {defineType, defineField} from "sanity";

export default defineType({
  name: "pageGoldflow",
  title: "GoldFlow Page",
  type: "document",

  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    }),
    defineField({
      name: "heroIntro",
      title: "Hero Intro",
      type: "text",
    }),
    // เพิ่มฟิลด์อื่น ๆ ได้ตามต้องการ
    // defineField({ name: "heroVideoUrl", title: "Hero Video URL", type: "url" }),
    // defineField({ name: "lineUrl", title: "LINE URL", type: "url" }),
  ],
});
