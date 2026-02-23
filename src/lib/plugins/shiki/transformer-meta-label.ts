import type { ShikiTransformer } from 'shiki'

/**
 * Transformer to extract label from meta string
 *
 * @example
 * ```bash [pnpm]
 * pnpm install
 * ```
 */
export default function transformerMetaLabel(): ShikiTransformer {
  return {
    name: 'transformer-meta-label',
    pre(node) {
      const meta = this.options.meta as { __raw?: string } | string | undefined
      const metaString = typeof meta === 'string' ? meta : meta?.__raw

      if (!metaString) return

      const match = metaString.match(/\[(.*?)\]/)
      if (match) {
        const label = match[1]
        if (node.properties) {
          node.properties['data-label'] = label
        }
      }
    },
  }
}
