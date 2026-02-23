import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

type DirectiveNode = {
  type: string
  name: string
  attributes?: Record<string, string>
  data?: Record<string, unknown>
}

export default function remarkBlockParser() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' && node.type !== 'leafDirective') return

      const n = node as unknown as DirectiveNode
      const data = n.data || (n.data = {})

      data.hName = n.name
      data.hProperties = { ...n.attributes }
    })
  }
}
