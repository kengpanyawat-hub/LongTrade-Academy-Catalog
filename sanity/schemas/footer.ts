import {defineType, defineField} from "sanity";
export default defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({name:"logo",  type:"image", title:"Logo"}),
    defineField({
      name:"links",
      title:"Footer Links",
      type:"array",
      of:[{type:"object", fields:[
        {name:"label", type:"string"},
        {name:"href",  type:"string"},
      ]}]
    }),
    defineField({
      name:"socials",
      title:"Social Links",
      type:"array",
      of:[{type:"object", fields:[
        {name:"kind", type:"string", options:{list:["facebook","line","youtube","website"]}},
        {name:"href", type:"url"},
      ]}]
    }),
  ]
});
