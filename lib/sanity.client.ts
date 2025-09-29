// lib/sanity.client.ts
import {createClient} from 'next-sanity';

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-01';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,        // ← ใส่เวอร์ชันให้ชัด
  useCdn: true,      // published content
  perspective: 'published',
});
