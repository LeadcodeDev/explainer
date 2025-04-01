// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeMermaid from 'rehype-mermaid';
import rehypeCodeGroup from 'rehype-code-group';
import rehypeCallouts from 'rehype-callouts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
} from '@shikijs/transformers'

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
    plugins: [tailwindcss()]
  }
});