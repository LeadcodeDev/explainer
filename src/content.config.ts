import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  permalink: z.string().optional(),
  order: z.number(),
  icon: z.string().optional(),
});

export const docDefaultSchema = z.object({
  label: z.string(),
  description: z.string(),
  permalink: z.string(),
  icon: z.string().optional(),
  directory: z.string(),
  collection: z.array(z.any()),
});

export const docDefaults = defineCollection({
  loader: glob({
    pattern: "**/_default.{md,mdx}",
    base: "./src/content/docs",
  }),
  schema: docDefaultSchema,
});

const directories = readdirSync(join(process.cwd(), "src/content/docs"));
const documentations = {
  ...directories.reduce((acc, directory) => {
    return {
      ...acc,
      [directory]: defineCollection({
        loader: glob({
          pattern: "**/[^_]*.{md,mdx}",
          base: `./src/content/docs/${directory}`,
        }),
        schema: docSchema,
      }),
    };
  }, {}),
};

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    thumbnail: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publishedAt: z.string().optional(),
  }),
});

export const collections = { docDefaults, blog, ...documentations };
