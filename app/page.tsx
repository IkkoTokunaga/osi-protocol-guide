import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

import OsiExplorer, { type OsiLayer } from "@/components/osi/OsiExplorer";

const ORDER: OsiLayer["id"][] = ["L7", "L6", "L5", "L4", "L3", "L2", "L1"];

const FILE_BY_LAYER: Record<OsiLayer["id"], string> = {
  L1: "layer1.md",
  L2: "layer2.md",
  L3: "layer3.md",
  L4: "layer4.md",
  L5: "layer5.md",
  L6: "layer6.md",
  L7: "layer7.md",
};

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return String(file);
}

function normalizeStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return [v];
  return [];
}

export default async function Page() {
  const contentDir = path.join(process.cwd(), "content");

  const layers: OsiLayer[] = await Promise.all(
    ORDER.map(async (id) => {
      const filePath = path.join(contentDir, FILE_BY_LAYER[id]);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);

      const data = parsed.data as Record<string, unknown>;
      const title = String(data.title ?? id);
      const protocols = normalizeStringArray(data.protocols);
      const commands = normalizeStringArray(data.commands);
      const memoHtml = await markdownToHtml(parsed.content);

      return {
        id,
        title,
        protocols,
        commands,
        memoHtml,
      };
    }),
  );

  return <OsiExplorer layers={layers} />;
}
