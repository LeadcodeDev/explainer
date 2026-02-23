import type { Root } from 'mdast'
import type { VFile } from 'vfile'

/**
 * Remark plugin that strips the `layout` field from MDX frontmatter
 * to prevent @astrojs/mdx from treating it as a module import.
 * The field remains accessible via content collection schema (Zod).
 */
export default function remarkStripLayout() {
  return (_tree: Root, file: VFile) => {
    const astroData = file.data as {
      astro?: { frontmatter?: Record<string, unknown> }
    }

    if (astroData.astro?.frontmatter?.layout) {
      astroData.astro.frontmatter.layout = undefined
    }
  }
}
