// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import rehypeMermaid from "rehype-mermaid";
import remarkBlockParser from "./src/lib/plugins/parser/plugin";
import remarkDirectivePkg from "remark-directive";
import sitemap from "@astrojs/sitemap";
import { buildDocIntegration } from "./src/hooks/build-doc";
import transformerMetaLabel from "./src/lib/plugins/shiki/transformer-meta-label";

export default defineConfig({
  site: "https://example.com",
  output: "static",
  prefetch: true,
  integrations: [react(), mdx(), icon(), buildDocIntegration(), sitemap()],

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "catppuccin-frappe",
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerMetaHighlight(),
        transformerMetaLabel(),
      ],
    },
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    remarkPlugins: [remarkDirectivePkg, remarkBlockParser],
    rehypePlugins: [rehypeMermaid],
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
    },
    plugins: [tailwindcss()],
  },
});
