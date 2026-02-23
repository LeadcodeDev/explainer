import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

export const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  permalink: z.string().optional(),
  icon: z.string().optional(),
  visibility: z.array(z.enum(['navbar'])).default([]),
})

export const docDefaultSchema = z.object({
  label: z.string(),
  description: z.string(),
  permalink: z.string(),
  icon: z.string().optional(),
  collection: z.array(z.string()),
})

export const docDefaults = defineCollection({
  loader: glob({
    pattern: '**/_default.{md,mdx}',
    base: './content/docs',
  }),
  schema: docDefaultSchema,
})

export const deepDocDefaults = defineCollection({
  loader: glob({
    pattern: '**/*_default.{md,mdx}',
    base: './content/docs',
  }),
  schema: docDefaultSchema,
})

export const docs = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './content/docs',
  }),
  schema: docSchema,
})

const pages = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', 'blog/index.{md,mdx}', '!docs/**/*'],
    base: './content',
  }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

const directories = readdirSync(join(process.cwd(), 'content/docs'))
const documentations = Object.fromEntries(
  directories.map((directory) => [
    directory,
    defineCollection({
      loader: glob({
        pattern: '**/[^_]*.{md,mdx}',
        base: `./content/docs/${directory}`,
      }),
      schema: docSchema,
    }),
  ]),
)

const blog = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!blog/index.{md,mdx}'],
    base: './content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    thumbnail: z.string().optional(),
    authors: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    publishedAt: z.string().optional(),
  }),
})

export const collections = {
  pages,
  docDefaults,
  deepDocDefaults,
  docs,
  blog,
  ...documentations,
}
