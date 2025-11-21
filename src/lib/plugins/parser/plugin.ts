import type { Element, Root } from "unist";
import { visit } from "unist-util-visit";

// Exemple de mapping startTag -> composant Astro
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

// Parse les attributs de la ligne :::tag key="value"
const parseAttributes = (str: string): Record<string, any> => {
  const regex = /(\w+)\s*=\s*(?:"([^"]*)"|(\S+))/g;
  const attrs: Record<string, any> = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    const key = match[1];
    let value: any;

    if (match[2] !== undefined) {
      // Valeur entre guillemets
      const raw = match[2];
      try {
        value = JSON.parse(raw); // Essayer de parser JSON
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

// Fonction principale : parse un node et retourne un Block[]
const parseSingleNode = (node: Element): Block[] => {
  // On combine le node text + mdxTextExpression éventuel en un seul texte
  let combinedText = "";

  for (const child of node.children || []) {
    if (child.type === "text") {
      combinedText += child.value;
    } else if ((child as any).type === "mdxTextExpression") {
      combinedText += " " + (child as any).value;
    }
  }

  // Fonction récursive interne pour parser un texte complet
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
          // Ajoute comme enfant du dernier parent
          stack[stack.length - 1].children.push(block);
        } else {
          // Bloc racine
          blocks.push(block);
        }

        stack.push(block); // push pour gérer la fermeture
      } else if (endMatch) {
        stack.pop(); // on ferme le bloc courant
      } else {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push({ type: "text", value: line });
        }
      }
    }

    // Pousser tout bloc restant dans stack (blocs non fermés)
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

// Plugin rehype
export default function rehypeComponents() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent) return;

      const parsedBlocks = parseSingleNode(node);

      console.log(JSON.stringify(parsedBlocks, null, 2));

      parent.children[index] = {
        type: "element",
        tagName: "BlockRenderer",
        properties: {
          ast: JSON.stringify(parsedBlocks),
        },
        children: [],
      } as Element;
    });
  };
}
