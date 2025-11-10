import { defineExplainerConfig } from "@/utils";

export default defineExplainerConfig({
  seo: {
    title: "Explainer",
    titleTemplate: "{} - {title}",
    description:
      "Quickly design your documentation and optimise it for search engine optimisation to showcase your products.",
    thumbnail: "https://placehold.co/1200x630",
  },
  socials: {
    github: "https://github.com/LeadcodeDev/explainer",
    twitter: "https://twitter.com/LeadcodeDev",
  },
  docs: {},

  meta: {
    title: "Explainer",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://placehold.co/1200x630",
  },
  urls: {
    github: "https://github.com/LeadcodeDev/explainer",
    getStarted: "/docs/framework/getting-started",
    documentation: "/docs/framework/installation",
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
  social: {
    github: {
      href: "https://github.com/LeadcodeDev/explainer",
      icon: "mdi:github",
    },
  },
});
