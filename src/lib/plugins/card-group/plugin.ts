import type { Root } from "unist";
import { visit } from "unist-util-visit";
import { CodeBlockSelector } from "./selector";

// Exemple de mapping startTag -> composant Astro
const mdx: Record<string, any> = {
  "card-group": "CardGroup",
  card: "Card",
  codeblock: "Codeblock",
};

interface Block {
  delimiter: string;
  startTag: string;
  attributes: Record<string, string>;
  children: Array<Block | { type: "text"; value: string }>;
}

const parseAttributes = (str: string): Record<string, any> => {
  const regex = /(\w+)\s*=\s*(?:"([^"]*)"|(\S+))/g;
  const attrs: Record<string, any> = {};
  let match;

  while ((match = regex.exec(str)) !== null) {
    const key = match[1];
    let value: any;

    // Valeur entre guillemets
    if (match[2] !== undefined) {
      const raw = match[2];

      // Essayer de parser JSON (array, object, number, boolean)
      try {
        value = JSON.parse(raw);
      } catch {
        value = raw; // fallback string
      }
    } else if (match[3] !== undefined) {
      // Valeur non-quoted (true, false, number, etc.)
      const raw = match[3];
      if (raw === "true") value = true;
      else if (raw === "false") value = false;
      else if (!isNaN(Number(raw))) value = Number(raw);
      else value = raw;
    }

    attrs[key] = value;
  }

  return attrs;
};

const parseSingleNode = (node: { type: string; children?: any[] }): Block[] => {
  const parseChildren = (children: any[]): Block[] => {
    const blocks: Block[] = [];
    const stack: Block[] = [];

    for (const child of children) {
      if (child.type === "text" || child.type === "mdxTextExpression") {
        const lines = child.value.split(/\r?\n/);
        for (const line of lines) {
          const startMatch = line.match(/^:::(\w[\w-]*)\s*(.*)$/);
          const endMatch = line.match(/^:::/);

          if (startMatch) {
            const block: Block = {
              delimiter: ":::",
              startTag: startMatch[1],
              attributes: parseAttributes(startMatch[2] || ""),
              children: [],
            };
            stack.push(block);
          } else if (endMatch) {
            const finished = stack.pop();
            if (!finished) continue;
            if (stack.length > 0) {
              stack[stack.length - 1].children.push(finished);
            } else {
              blocks.push(finished);
            }
          } else {
            if (stack.length > 0) {
              stack[stack.length - 1].children.push({
                type: "text",
                value: line,
              });
            }
          }
        }
      } else if (child.type === "element") {
        const availableBlock = [CodeBlockSelector];
        const selector = availableBlock.find((selector) =>
          selector.filter(child),
        );

        if (selector) {
          if (stack.length > 0) {
            stack[stack.length - 1].children.push(selector.render(child));
          } else {
            blocks.push(selector.render(child));
          }
        }
      }
    }

    return blocks;
  };

  return parseChildren(node.children || []);
};

// Usage dans rehypeComponents
export default function rehypeComponents(): Plugin<[], Root> {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      const parsedBlocks = parseSingleNode(node);

      parent.children[index] = {
        type: "element",
        tagName: "BlockRenderer",
        properties: { ast: JSON.stringify(parsedBlocks) },
        children: [], // ou des enfants si nécessaire
      };
    });
  };
}
