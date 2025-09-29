// sanity.config.ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import schemaTypes from './sanity/schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId || !dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
}

export default defineConfig({
  name: 'longtrade-cms',
  title: 'Longtrade CMS',
  projectId,
  dataset,
  // basePath ไม่จำเป็นเมื่อ mount ผ่าน /app/admin/[[...index]]
  plugins: [
    // ตั้งชื่อเครื่องมือเป็น 'admin' ให้ตรงกับ URL เดิม
    deskTool({ name: 'admin', title: 'Structure' }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
