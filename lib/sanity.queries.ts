// lib/sanity.queries.ts
export const reviewsByPageQuery = (page: string) => `
*[_type=="review" && page==$page] | order(order asc){ name, text }
`

export const goldflowPageQuery = `
*[_type=="pageGoldflow"][0]{ heroTitle, heroIntro, videoUrl, "showcaseUrl": showcaseImage.asset->url }
`

export type ReviewDoc = { name: string; text: string }
export type GoldflowPageDoc = {
  heroTitle?: string; heroIntro?: string; videoUrl?: string; showcaseUrl?: string
}
