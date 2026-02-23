/**
 * Remark plugin that strips the `layout` field from MDX frontmatter
 * to prevent @astrojs/mdx from treating it as a module import.
 * The field remains accessible via content collection schema (Zod).
 */
export default function remarkStripLayout() {
  return (tree, file) => {
    if (file.data.astro?.frontmatter?.layout) {
      delete file.data.astro.frontmatter.layout;
    }
  };
}
