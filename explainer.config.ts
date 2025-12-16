import Callout from "@/components/content/callout.astro";
import CardGroup from "@/components/content/card-group/card-group.astro";
import Card from "@/components/content/card-group/card.astro";
import CodeGroup from "@/components/content/code-group/code-group.astro";
import CodePreview from "@/components/content/code-preview/code-preview.astro";
import ContentPreview from "@/components/content/code-preview/content-preview.astro";
import Preview from "@/components/content/code-preview/preview.astro";
import CodeBlock from "@/components/content/codeblock.astro";
import StepGroup from "@/components/content/step-group/step-group.astro";
import Step from "@/components/content/step-group/step.astro";
import Articles from "@/components/elements/articles.astro";
import { defineExplainerConfig } from "@/utils";

export default defineExplainerConfig({
  repository: "https://github.com/LeadcodeDev/explainer",
  projectName: "Explainer",
  seo: {
    title: "Explainer • Make your own documentation easily",
    description:
      "Quickly design your documentation and optimise it for search engine optimisation to showcase your products.",
    thumbnail: "https://placehold.co/1200x630",
  },
  socials: {
    media: {
      github: "https://github.com/LeadcodeDev/explainer",
      twitter: "https://twitter.com/LeadcodeDev",
      linkedin: "https://linkedin.com/in/leadcode-dev",
    },
  },
  blog: {
    defaults: {
      thumbnail: "https://placehold.co/1200x630",
    },
    authors: {
      leadcode_dev: {
        name: "LeadcodeDev",
        avatar: "https://avatars.githubusercontent.com/u/8946317?v=4",
        href: "https://github.com/LeadcodeDev",
      },
    },
  },
  navbar: [
    {
      label: "API",
      href: "/api",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  content: {
    components: {
      "card-group": CardGroup,
      card: Card,
      codegroup: CodeGroup,
      "code-group": CodeGroup,
      pre: CodeBlock,
      callout: Callout,
      "step-group": StepGroup,
      step: Step,
      "code-preview": CodePreview,
      "content-preview": ContentPreview,
      preview: Preview,
      articles: Articles,
    },
    icons: {
      markdown: "devicon:markdown",
      mdx: "devicon:markdown",
      html: "devicon:html5",
      css: "devicon:css3",
      javascript: "devicon:javascript",
      js: "devicon:javascript",
      typescript: "devicon:typescript",
      ts: "devicon:typescript",
      python: "devicon:python",
      py: "devicon:python",
      dart: "devicon:dart",
      rust: "catppuccin:rust",
      rs: "catppuccin:rust",
      npm: "devicon:npm",
      npx: "devicon:npm",
      yarn: "devicon:yarn",
      pnpm: "devicon:pnpm",
      bun: "devicon:bun",
      vite: "devicon:vite",
      "tailwind.config.js": "devicon:tailwindcss",
      "tailwind.config.ts": "devicon:tailwindcss",
      react: "devicon:react",
      nextjs: "devicon:nextjs",
      svelte: "devicon:svelte",
      vue: "devicon:vuejs",
      go: "devicon:go",
      bash: "devicon:bash",
      sh: "devicon:bash",
      shell: "devicon:bash",
      sql: "devicon:azuresqldatabase",
      yaml: "devicon:yaml",
      yml: "devicon:yaml",
      json: "devicon:json",
      dockerfile: "devicon:docker",
      git: "devicon:git",
      github: "devicon:github",
      gitlab: "devicon:gitlab",
    },
  },
});
