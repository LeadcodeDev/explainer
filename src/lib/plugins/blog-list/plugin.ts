import type { Root } from "hast";
import { visit } from "unist-util-visit";

const rehypeBlogListReact = () => {
  return (tree: Root) => {
    visit(tree, (node: any, index?: number, parent?: any) => {
      if (
        node.type === "element" &&
        node.tagName === "p" &&
        node.children.length &&
        node.children[0].type === "text" &&
        node.children[0].value === ":::blog-list"
      ) {
        node.tagName = "BlogListWrapper";

        node.properties = {
          ...(node.properties || {}),
          isJsxComponent: true,
        };

        node.children = [];
      }
    });
  };
};

export default rehypeBlogListReact;
