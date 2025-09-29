import {defineType, defineField} from "sanity";

export default defineType({
  name: "indicator",
  title: "Indicators",
  type: "document",
  fields: [
    defineField({ name:"title", title:"Title", type:"string", validation:r=>r.required() }),
    defineField({ name:"slug",  title:"Slug", type:"slug", options:{source:"title", maxLength:96}, validation:r=>r.required() }),
    defineField({ name:"intro", title:"Intro", type:"text" }),
    defineField({ name:"videoUrl", title:"Video URL", type:"url" }),
    defineField({
      name:"sections",
      title:"Sections",
      type:"array",
      of:[{
        type:"object",
        fields:[
          {name:"title", type:"string", title:"Title"},
          {name:"body",  type:"text", title:"Body"},
          {name:"images", type:"array", title:"Images", of:[{type:"image"}]},
        ]
      }]
    }),
    defineField({ name:"showcaseImage", title:"Showcase Image", type:"image" }),
    defineField({ name:"reviews", title:"Reviews", type:"array", of:[{type:"reference", to:[{type:"review"}]}] }),
  ]
});
