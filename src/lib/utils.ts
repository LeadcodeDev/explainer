import type { getCollection, getEntry } from "astro:content";
import { clsx, type ClassValue } from "clsx";
import type { ComponentType } from "react";
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

export function buildHeadingTree(
  headings: { depth: number; slug: string; text: string }[],
): HeadingNode[] {
  const result: HeadingNode[] = [];
  let currentH2: HeadingNode | null = null;

  for (const heading of headings) {
    const node: HeadingNode = {
      depth: heading.depth,
      slug: heading.slug,
      text: heading.text,
      children: [],
    };

    if (heading.depth === 2) {
      currentH2 = node;
      result.push(node);
    } else if (heading.depth === 3 && currentH2) {
      currentH2.children.push(node);
    }
  }

  return result;
}

/** Data shape for doc page entries (from `docs` collection) */
export type DocPageData = {
  title: string;
  description: string;
  permalink?: string;
  icon?: string;
  visibility: string[];
};

/** Data shape for doc section defaults (from `docDefaults`/`deepDocDefaults`) */
export type DocDefaultData = {
  label: string;
  description: string;
  permalink: string;
  icon?: string;
  collection: string[];
};

/** A leaf documentation page */
export type DocPage = {
  id: string;
  collection: string;
  data: DocPageData;
  filePath?: string;
};

/** A section node that can contain children (pages or nested sections) */
export type DocSection = {
  id: string;
  collection: string;
  data: DocDefaultData;
  children: DocTreeNode[];
};

/** A node in the documentation tree: either a section or a leaf page */
export type DocTreeNode = DocSection | DocPage;

/** Type guard: checks if a doc tree node is a section (has children) */
export function isDocSection(node: DocTreeNode): node is DocSection {
  return "children" in node;
}

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
    icons: Record<string, string>;
    components: Record<
      string,
      string | ComponentType | ((...args: unknown[]) => unknown)
    >;
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
  async function buildTree(root: string): Promise<DocSection> {
    const { join } = await import("node:path");
    const { readdir, stat } = await import("node:fs/promises");

    let _default: DocSection = {
      id: "",
      collection: "",
      data: { label: "", description: "", permalink: "", collection: [] },
      children: [],
    };
    const pages: DocPage[] = [];

    let elements: string[];
    try {
      elements = await readdir(root);
    } catch (error) {
      console.error(`[explainer] Failed to read directory: ${root}`, error);
      return _default;
    }
    for (const element of elements) {
      const currentElementPath = join(root, element);
      const elementStat = await stat(currentElementPath);

      if (elementStat.isDirectory()) {
        const currentObj = await buildTree(join(root, element));
        if (!currentObj.data.label) {
          console.warn(
            `[explainer] Missing or empty _default.mdx in ${join(root, element)}. Section will have no label.`,
          );
        }
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

          if (astroElement) {
            _default = { ...astroElement, children: [] } as DocSection;
          }
        } else {
          const location = root.replace(
            join(process.cwd(), "content", "docs/"),
            "",
          );
          const [filename] = element.split(".");

          const astroElement = await astro.getEntry(
            "docs",
            join(location, filename),
          );

          if (astroElement) {
            pages.push(astroElement as unknown as DocPage);
          }
        }
      }
    }

    if (_default.data.collection) {
      for (const collectionName of _default.data.collection) {
        const location = root.replace(
          join(process.cwd(), "content", "docs/"),
          "",
        );
        const targetId = join(location, collectionName);
        const targetPage = pages.find((page) => page.id === targetId);

        if (targetPage) {
          _default.children.push(targetPage);
        }
      }
    }

    for (const folder of _default.children) {
      if (isDocSection(folder) && folder.data.collection) {
        for (const collectionName of folder.data.collection) {
          const index = folder.data.collection.indexOf(collectionName);
          const targetId = join(
            folder.id.replace("/_default", ""),
            `${collectionName}/_default`,
          );
          const targetChild = folder.children.find(
            (page) => page.id === targetId,
          );

          if (targetChild) {
            const folderIndex = folder.children.indexOf(targetChild);
            folder.children.splice(folderIndex, 1);
            folder.children.splice(index, 0, targetChild);
          }
        }
      }
    }

    return _default;
  }

  async function load(): Promise<DocTreeNode[]> {
    const { join } = await import("node:path");

    const root = join(process.cwd(), "content", "docs");
    return buildTree(root).then((tree) => tree.children);
  }

  async function generateStaticPaths() {
    const docs = await load();

    function flattenChildren(
      children: DocTreeNode[],
    ): { params: { slug: string }; props: { element: DocTreeNode } }[] {
      return children.flatMap((child) => {
        return [
          {
            params: { slug: child.id },
            props: { element: child },
          },
          ...(isDocSection(child) && child.children.length
            ? flattenChildren(child.children)
            : []),
        ];
      });
    }

    return docs.flatMap((root) =>
      isDocSection(root) ? flattenChildren(root.children) : [],
    );
  }

  function flattenDocs(elements: DocTreeNode[]): DocPage[] {
    const pages: DocPage[] = [];

    function flatten(children: DocTreeNode[]) {
      for (const element of children) {
        if (isDocSection(element) && element.children.length) {
          flatten(element.children);
        } else {
          pages.push(element as DocPage);
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
