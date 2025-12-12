import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * Plugin remark qui transforme les directives ::read-more en éléments HTML read-more
 * pour être traités ensuite par le plugin rehype
 */
const remarkReadMoreDirective = () => {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (
        (node.type === "textDirective" ||
          node.type === "leafDirective" ||
          node.type === "containerDirective") &&
        node.name === "read-more"
      ) {
        const data = node.data || (node.data = {});
        data.hName = "read-more";

        if (node.attributes) {
          data.hProperties = node.attributes;
        }
      }
    });
  };
};

export default remarkReadMoreDirective;
