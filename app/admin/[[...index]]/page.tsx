// app/admin/[[...index]]/page.tsx
'use client'

import {Studio} from 'sanity'
import config from '@/sanity.config'

export default function AdminStudio() {
  return <Studio config={config} />
}
