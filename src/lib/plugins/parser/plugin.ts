import type { Element, Root } from "unist";
import { visit } from "unist-util-visit";

const mdx: Record<string, string> = {
  "card-group": "CardGroup",
  card: "Card",
};

interface Block {
  delimiter: string;
  startTag: string;
  attributes: Record<string, any>;
  children: Array<Block | { type: "text"; value: string }>;
}

const parseAttributes = (str: string): Record<string, any> => {
  const regex = /(\w+)\s*=\s*(?:"([^"]*)"|([^,\s]+))/g;
  const attrs: Record<string, any> = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    const key = match[1];
    let value: any;
    if (match[2] !== undefined) {
      const raw = match[2];
      try {
        value = JSON.parse(raw);
      } catch {
        value = raw;
      }
    } else if (match[3] !== undefined) {
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

const parseSingleNode = (node: Element): Block[] => {
  let combinedText = "";

  for (const child of node.children || []) {
    if (child.type === "text") {
      combinedText += child.value;
    } else if ((child as any).type === "mdxTextExpression") {
      combinedText += " " + (child as any).value;
    }
  }

  const parseBlockText = (text: string): Block[] => {
    const blocks: Block[] = [];
    const lines = text.split(/\r?\n/);
    const stack: Block[] = [];

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

        if (stack.length > 0) {
          stack[stack.length - 1].children.push(block);
        } else {
          blocks.push(block);
        }

        stack.push(block);
      } else if (endMatch) {
        stack.pop();
      } else {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push({ type: "text", value: line });
        }
      }
    }

    while (stack.length > 0) {
      const remaining = stack.pop()!;
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(remaining);
      } else if (!blocks.includes(remaining)) {
        blocks.push(remaining);
      }
    }

    return blocks;
  };

  return parseBlockText(combinedText);
};

export default function rehypeComponents() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent) return;

      const parsedBlocks = parseSingleNode(node);
      const hasBlock = parsedBlocks.some((block) => block.startTag in mdx);

      if (hasBlock) {
        console.log(JSON.stringify(parsedBlocks, null, 2));

        parent.children[index] = {
          type: "element",
          tagName: "BlockRenderer",
          properties: {
            ast: JSON.stringify(parsedBlocks),
          },
          children: [],
        } as Element;
      }
    });
  };
}
