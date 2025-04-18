import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const main = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/main" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    icon: z.string().optional(),
  }),
})

const test = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/test" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    icon: z.string().optional(),
  }),
})

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    icon: z.string().optional(),
    thumbnail: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publishedAt: z.string().optional()
  }),
})

export const collections = { blog, main, test };