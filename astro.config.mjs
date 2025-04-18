// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import rehypeCallouts from 'rehype-callouts';
import rehypeCodeGroup from 'rehype-code-group';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'catppuccin-frappe',
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerMetaHighlight(),
      ]
    },
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      rehypeMermaid,
      [rehypeCallouts, {
        customClassNames: {
          calloutClass: "callout",
          calloutTitleClass: "callout-title",
          calloutContentClass: "callout-content",
        }
      }],
      [rehypeCodeGroup, {
        customClassNames: {
          codeGroupClass: "code-group",
          tabContainerClass: "tab-container",
          tabClass: "tab",
          blockContainerClass: "content-container",
        }
      }]
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  }
});