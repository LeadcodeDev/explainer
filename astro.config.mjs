// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  markdown: {
    shikiConfig: {
      theme: 'catppuccin-frappe',
    },
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [rehypeMermaid],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});