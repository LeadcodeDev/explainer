import type { getCollection, getEntry } from "astro:content";
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

type NavbarItem = {
  label: string;
  description: string;
  href: string;
};

type ExplainerConfig = {
  repository?: string;
  projectName: string;
  seo: {
    title: string;
    description: string;
    thumbnail: string;
  };
  socials: {
    icons?: { [key: string]: string };
    media: { [key: string]: string };
  };
  blog: {
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
  navbar: {
    label: string;
    href: string;
  }[];
};

export function defineExplainerConfig(config: ExplainerConfig) {
  config.socials.icons = {
    github: "mdi:github",
    twitter: "mdi:twitter",
    linkedin: "mdi:linkedin",
    ...(config.socials.icons ?? {}),
  };

  return config;
}

export function useDocumentation(astro: {
  getCollection: typeof getCollection;
  getEntry: typeof getEntry;
}) {
  async function load() {
    const { getCollection, getEntry } = astro;
    const defaults = await getCollection("docDefaults");

    return Promise.all(
      defaults.map(async (entry) => {
        let children = await Promise.all(
          entry.data.collection.map(async (child) => {
            const [filename, visible] = Object.entries(child)[0];
            const element = await getEntry(
              entry.data.directory as any,
              filename as any,
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

  async function getPages() {
    const { getCollection, getEntry } = astro;
    const defaults = await getCollection("docDefaults");

    const pages = [];

    for (const entry of defaults) {
      let children = await Promise.all(
        entry.data.collection.flatMap(async (child) => {
          const [filename, visible] = Object.entries(child)[0];
          const element = await getEntry(
            entry.data.directory as any,
            filename as any,
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

      pages.push(...children);
    }

    return pages;
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
    getPages,
  };
}
