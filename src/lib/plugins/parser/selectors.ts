import { toHtml } from "hast-util-to-html";

export const codeblockSelector = {
  filter: (child: any) => {
    return child.tagName === "code" && child.children[0].type !== "text";
  },
  metadata: (child: any) => ({
    delimiter: "",
    startTag: "codeblock",
    attributes: { html: toHtml(child) },
    children: [],
  }),
};

export const cardGroupSelector = {
  filter: (child: any) => {
    return child.tagName === "card-group";
  },
  metadata: (child: any) => ({
    delimiter: "",
    startTag: "card-group",
    attributes: child.attributes,
    children: child.children,
  }),
};
