import type { CollectionKey } from "astro:content";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HeadingNode = {
  depth: number;
  slug: string;
  text: string;
  children: HeadingNode[];
};

type NavbarCollection = {
  label: string;
  items?: NavbarItem[];
  href?: string;
};

type NavbarItem = {
  label: string;
  description: string;
  href: string;
};

type ExplainerMeta = {
  title: string;
  description: string;
  thumbnail: string;
};

type ExplainerDocs = {
  icon: string;
  label: string;
  href: string;
  baseUrl: string;
  baseRepositoryUrl: string;
};

type ExplainerBlog = {
  defaults: {
    thumbnail?: string;
  };
  authors: {
    [key: string]: {
      name: string;
      avatar: string;
      href: string;
    };
  };
};

const SocialLink = {
  github: "Github",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitch: "Twitch",
} as const;

type ExplainerSocial = {
  [key in keyof typeof SocialLink]?: {
    href: string;
    icon: string;
  };
};

type ExplainerConfig = {
  meta: ExplainerMeta;
  docs: { [key in CollectionKey]?: ExplainerDocs };
  urls: {
    github?: string;
    getStarted?: string;
    documentation?: string;
  };
  navbar: NavbarCollection[];
  blog: ExplainerBlog;
  social: ExplainerSocial;
};

export function defineExplainerConfig(config: ExplainerConfig) {
  return config;
}

export function useDocumentation() {
  async function load() {
    const { getCollection, getEntry } = await import("astro:content");
    const defaults = await getCollection("docDefaults");

    return Promise.all(
      defaults.map(async (entry) => {
        let children = await Promise.all(
          entry.data.collection.map(async (child) => {
            const [filename, visible] = Object.entries(child)[0];
            const element = await getEntry(
              entry.data.directory as unknown as CollectionKey,
              filename as unknown as CollectionKey,
            );

            if (!element) {
              console.error(`Element not found: ${filename}`);
              return null;
            }

            return {
              ...element,
              visible,
              href: `/docs/${entry.data.permalink}/${(element as any).data.permalink}`,
            };
          }),
        );

        return { ...entry.data, collection: children };
      }),
    );
  }

  async function generateStaticPaths() {
    const derived = await load();
    return derived.flatMap((element) =>
      element.collection.map((item) => ({
        params: {
          slug:
            item?.collection +
            "/" +
            (item?.data as unknown as { permalink: string }).permalink,
        },
        props: { element: item },
      })),
    );
  }

  return {
    load,
    generateStaticPaths,
  };
}
