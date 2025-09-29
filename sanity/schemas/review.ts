import { defineField, defineType } from "sanity";

export default defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Text", type: "text", validation: r => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: r => r.required() }),
  ],
});
