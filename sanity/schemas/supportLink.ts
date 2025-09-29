import {defineType, defineField} from "sanity";
export default defineType({
  name: "supportLink",
  title: "Support Links",
  type: "document",
  fields: [
    defineField({name:"label", type:"string", validation:r=>r.required()}),
    defineField({name:"href",  type:"url", validation:r=>r.required()}),
    defineField({name:"kind",  type:"string", options:{list:["fb","line","yt","web","promo-lt","promo-xm"]}}),
    defineField({name:"iconImage", type:"image"}), // เฉพาะปุ่มใช้รูป
    defineField({name:"order", type:"number"}),
  ]
});
