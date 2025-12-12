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
  content: {
    components: {
      [key: string]: (...props: any[]) => any;
    };
  };
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

    let _default: { children: any[] } = { children: [] };
    const pages: any[] = [];

    const elements = await readdir(root);
    for (const element of elements) {
      const currentElementPath = join(root, element);
      const elementStat = await stat(currentElementPath);

      if (elementStat.isDirectory()) {
        const currentObj = await buildTree(join(root, element));
        _default.children.push(currentObj);
      }

      if (elementStat.isFile()) {
        if (element.startsWith("_default")) {
          const location = root.replace(
            join(process.cwd(), "content", "docs/"),
            "",
          );
          const astroElement = await astro.getEntry(
            "deepDocDefaults",
            join(location, "_default"),
          );

          _default = { ...astroElement, children: [] };
        } else {
          const location = root.replace(
            join(process.cwd(), "content", "docs/"),
            "",
          );
          const [filename, __] = element.split(".");

          const astroElement = await astro.getEntry(
            "docs",
            join(location, filename),
          );

          pages.push(astroElement);
        }
      }
    }

    if ((_default as any)?.data?.collection) {
      for (const collection of (_default as any).data.collection) {
        const location = root.replace(
          join(process.cwd(), "content", "docs/"),
          "",
        );
        const targetId = join(location, collection);
        const targetPage = pages.find((page) => page.id === targetId);

        if (targetPage) {
          _default.children.push(targetPage);
        }
      }
    }

    for (const folder of _default.children) {
      if (folder.data.collection) {
        for (const collection of folder.data.collection) {
          const index = folder.data.collection.indexOf(collection);
          const targetId = join(
            folder.id.replace("/_default", ""),
            `${collection}/_default`,
          );
          const targetPage = folder.children.find(
            (page: any) => page.id === targetId,
          );

          if (targetPage) {
            const folderIndex = folder.children.indexOf(targetPage);
            folder.children.splice(folderIndex, 1);
            folder.children.splice(index, 0, targetPage);
          }
        }
      }
    }

    return _default;
  }

  async function load(): Promise<any[]> {
    const { join } = await import("node:path");

    const root = join(process.cwd(), "content", "docs");
    return buildTree(root).then((tree) => tree.children);
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
    flattenDocs,
  };
}
