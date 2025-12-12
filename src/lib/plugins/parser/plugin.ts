import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkBlockParser() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective")
        return;

      const n = node as any;
      const data = n.data || (n.data = {});

      data.hName = n.name;
      data.hProperties = { ...n.attributes };
    });
  };
}
