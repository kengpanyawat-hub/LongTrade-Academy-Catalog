// sanity/schemas/pageGoldflow.ts
import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'pageGoldflow',
  title: 'Page: Goldflow',
  type: 'document',
  // singleton
  __experimental_formPreviewTitle: 'Goldflow Page',
  fields: [
    defineField({ name:'heroTitle', title:'Hero Title', type:'string' }),
    defineField({ name:'heroIntro', title:'Hero Intro', type:'text' }),
    defineField({ name:'videoUrl', title:'Video URL', type:'url' }),
    defineField({ name:'showcaseImage', title:'Showcase Image', type:'image', options:{hotspot:true} }),
  ]
})
