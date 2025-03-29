import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const main = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/main' }),
  schema: z.object({
    title: z.string(),
    permalink: z.string().optional(),
  }),
})

export const collections = { main };