import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  permalink: z.string().optional(),
  icon: z.string().optional(),
});

export const docDefaultSchema = z.object({
  label: z.string(),
  description: z.string(),
  permalink: z.string(),
  icon: z.string().optional(),
  directory: z.string(),
  collection: z.array(z.any()),
  visibility: z.array(z.enum(["navbar"])).default([]),
});

export const docDefaults = defineCollection({
  loader: glob({
    pattern: "**/_default.{md,mdx}",
    base: "./content/docs",
  }),
  schema: docDefaultSchema,
});

export const deepDocDefaults = defineCollection({
  loader: glob({
    pattern: "**/*_default.{md,mdx}",
    base: "./content/docs",
  }),
  schema: docDefaultSchema,
});

export const docs = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./content/docs",
  }),
  schema: docSchema,
});

const pages = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "blog/index.{md,mdx}", "!docs/**/*"],
    base: "./content",
  }),
  schema: z.object({}),
});

const directories = readdirSync(join(process.cwd(), "content/docs"));
const documentations = {
  ...directories.reduce((acc, directory) => {
    return {
      ...acc,
      [directory]: defineCollection({
        loader: glob({
          // pattern: "**/[^_]*.{md,mdx}",
          pattern: "**/[^_]*.{md,mdx}",
          base: `./content/docs/${directory}`,
        }),
        schema: docSchema,
      }),
    };
  }, {}),
};

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!blog/index.{md,mdx}"],
    base: "./content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    thumbnail: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publishedAt: z.string().optional(),
  }),
});

export const collections = {
  pages,
  docDefaults,
  deepDocDefaults,
  docs,
  blog,
  ...documentations,
};
