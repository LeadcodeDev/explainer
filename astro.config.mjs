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
import rehypeCallouts from "rehype-callouts";
import rehypeMermaid from "rehype-mermaid";
import rehypeCodeGroupReact from "./src/lib/plugins/code-group/plugin";
import rehypeReadMoreReact from "./src/lib/plugins/read-more/plugin";
import rehypeBlogListReact from "./src/lib/plugins/blog-list/plugin";
import rehypeBlock from "./src/lib/plugins/parser/plugin";
import {
  default as remarkDirective,
  default as remarkReadMoreDirective,
} from "./src/lib/plugins/read-more/remark-directive";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  output: "static",
  prefetch: true,
  integrations: [react(), mdx(), icon(), sitemap()],

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
      ],
    },
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    remarkPlugins: [remarkDirective, remarkReadMoreDirective],
    rehypePlugins: [
      rehypeBlock,
      rehypeMermaid,
      [
        rehypeCallouts,
        {
          customClassNames: {
            calloutClass: "callout",
            calloutTitleClass: "callout-title",
            calloutContentClass: "callout-content",
          },
        },
      ],
      rehypeCodeGroupReact,
      rehypeReadMoreReact,
      rehypeBlogListReact,
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
