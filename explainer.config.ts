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
});
