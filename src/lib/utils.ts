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
  async function buildTree(root: string) {
    const { join } = await import("node:path");
    const { readdir, stat } = await import("node:fs/promises");
    let obj: { children: any[] } = { children: [] };

    const elements = await readdir(root);
    for (const element of elements) {
      const currentElementPath = join(root, element);
      const elementStat = await stat(currentElementPath);

      if (elementStat.isDirectory()) {
        const currentObj = await buildTree(join(root, element));
        obj.children.push(currentObj);
      }

      if (elementStat.isFile()) {
        if (element.startsWith("_default")) {
          const [_, location] = root.split("/docs/");
          const astroElement = await astro.getEntry(
            "deepDocDefaults",
            join(location, "_default"),
          );

          obj = { ...astroElement, ...obj };
        } else {
          const [_, location] = root.split("/docs/");
          const [filename, __] = element.split(".");

          const astroElement = await astro.getEntry(
            "docs",
            join(location, filename),
          );

          obj.children.push(astroElement);
        }
      }
    }

    return obj;
  }

  async function load(): Promise<any[]> {
    const { join } = await import("node:path");

    const root = join(process.cwd(), "content", "docs");
    return buildTree(root).then((obj) => obj.children);
  }

  async function getDocs() {
    const default_docs = await astro.getCollection("docDefaults");
    const docs = await load();

    const a = default_docs.filter(
      (element) => !docs.some((doc) => doc.id === element.id),
    );

    return a.map((element) => {
      const children = docs
        .filter((doc) => doc.id.startsWith(element.data.directory))
        .flatMap((child) => child.children);

      return {
        ...element,
        children: children ? [...children] : [],
      };
    });
  }

  async function generateStaticPaths() {
    const docs = await load();

    function flattenChildren(children: any[]): any[] {
      return children.flatMap((child) => {
        return [
          {
            params: { slug: child.id },
            props: { element: child },
          },
          ...(child.children && child.children.length
            ? flattenChildren(child.children)
            : []),
        ];
      });
    }

    return docs.flatMap((root) => flattenChildren(root.children));
  }

  function flattenDocs(elements: any[]) {
    const pages: any[] = [];

    function flatten(children: any[]) {
      for (const element of children) {
        if (element.children && element.children.length) {
          flatten(element.children);
        } else {
          pages.push(element);
        }
      }
    }

    flatten(elements);

    return pages;
  }

  return {
    load,
    generateStaticPaths,
    getDocs,
    flattenDocs,
  };
}
