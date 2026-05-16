import type { BlockContent, PortableTextBlock, PortableTextStyle } from "@/lib/types";

type CreatePortableTextBlockOptions = {
  style?: PortableTextStyle;
  listItem?: "bullet" | "number";
  level?: number;
};

export function createPortableTextBlock(
  text: string,
  options: CreatePortableTextBlockOptions = {}
): PortableTextBlock {
  return {
    _type: "block",
    style: options.style ?? "normal",
    children: [
      {
        _type: "span",
        text
      }
    ],
    markDefs: [],
    ...(options.listItem ? { listItem: options.listItem } : {}),
    ...(options.level ? { level: options.level } : {})
  };
}

export function normalizeBlockContent(
  value: BlockContent | string[] | null | undefined
): BlockContent {
  if (!value || value.length === 0) {
    return [];
  }

  if (typeof value[0] === "string") {
    return (value as string[]).map((paragraph) => createPortableTextBlock(paragraph));
  }

  return value as BlockContent;
}

export function getPlainTextFromBlockContent(
  value: BlockContent | string[] | null | undefined
) {
  const blocks = normalizeBlockContent(value);

  return blocks
    .map((block) => {
      if (block._type !== "block") {
        return "";
      }

      return block.children.map((child) => child.text).join("");
    })
    .filter(Boolean)
    .join("\n\n");
}
