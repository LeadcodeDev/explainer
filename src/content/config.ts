import { defineCollection, z } from 'astro:content';

const main = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    permalink: z.string().optional(),
  }),
});

export const collections = {
  'main': main,
}; 