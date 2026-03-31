import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export type OsiLayerId = "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";

export type ProtocolDetail = {
  name: string;
  slug: string;
  detailHtml: string;
  rawBody: string;
  role: string;
  practicalUse: string;
  checkPoint: string;
  ccnaFocus: string;
};

export type OsiLayer = {
  id: OsiLayerId;
  title: string;
  protocols: string[];
  commands: string[];
  protocolDetails: ProtocolDetail[];
  memoHtml: string;
};

const ORDER: OsiLayerId[] = ["L7", "L6", "L5", "L4", "L3", "L2", "L1"];

const FILE_BY_LAYER: Record<OsiLayerId, string> = {
  L1: "layer1.md",
  L2: "layer2.md",
  L3: "layer3.md",
  L4: "layer4.md",
  L5: "layer5.md",
  L6: "layer6.md",
  L7: "layer7.md",
};

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified().use(remarkParse).use(remarkHtml).process(markdown);
  return String(file);
}

function normalizeStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return [v];
  return [];
}

function parseProtocolSections(markdown: string): Array<{ name: string; body: string }> {
  const sections: Array<{ name: string; body: string }> = [];
  const headingPattern = /^###\s+(.+)$/gm;
  const matches = [...markdown.matchAll(headingPattern)];

  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = (current.index ?? 0) + current[0].length;
    const end = next?.index ?? markdown.length;
    const body = markdown.slice(start, end).trim();
    const name = current[1]?.trim() ?? "";

    if (name) {
      sections.push({ name, body });
    }
  }

  return sections;
}

function extractBulletValue(body: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^-\\s+\\*\\*${escaped}\\*\\*:\\s*(.+)$`, "m");
  return body.match(re)?.[1]?.trim() ?? "";
}

function toProtocolSlug(input: string): string {
  const trimmed = input.trim().toLowerCase();
  const specialMap: Record<string, string> = {
    "光ファイバー": "hikari-fiber",
  };
  const fromSpecial = specialMap[trimmed];
  if (fromSpecial) return fromSpecial;

  const normalized = trimmed
    .normalize("NFKC")
    .replace(/[()]/g, " ")
    .replace(/[./]/g, " ")
    .replace(/\+/g, " plus ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\s*\/\s*/g, " ")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "protocol";
}

export async function loadOsiLayers(): Promise<OsiLayer[]> {
  const contentDir = path.join(process.cwd(), "content");

  return Promise.all(
    ORDER.map(async (id) => {
      const filePath = path.join(contentDir, FILE_BY_LAYER[id]);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);

      const data = parsed.data as Record<string, unknown>;
      const title = String(data.title ?? id);
      const protocols = normalizeStringArray(data.protocols);
      const commands = normalizeStringArray(data.commands);
      const contentParts = parsed.content.split(/^##\s+メモ\s*$/m);
      const protocolArea = contentParts[0] ?? "";
      const memoMarkdown = (contentParts[1] ?? "").trim();

      const parsedProtocolSections = parseProtocolSections(protocolArea);
      const protocolDetails = await Promise.all(
        parsedProtocolSections.map(async (section) => ({
          name: section.name,
          slug: toProtocolSlug(section.name),
          detailHtml: await markdownToHtml(section.body),
          rawBody: section.body,
          role: extractBulletValue(section.body, "役割"),
          practicalUse: extractBulletValue(section.body, "実務での見どころ"),
          checkPoint: extractBulletValue(section.body, "確認ポイント"),
          ccnaFocus: extractBulletValue(section.body, "CCNA頻出"),
        })),
      );

      const memoHtml = memoMarkdown ? await markdownToHtml(memoMarkdown) : "";

      return {
        id,
        title,
        protocols,
        commands,
        protocolDetails,
        memoHtml,
      };
    }),
  );
}

export async function findProtocolBySlug(slug: string): Promise<{
  layer: OsiLayer;
  protocol: ProtocolDetail;
} | null> {
  const layers = await loadOsiLayers();
  for (const layer of layers) {
    for (const protocol of layer.protocolDetails) {
      if (protocol.slug === slug) {
        return { layer, protocol };
      }
    }
  }
  return null;
}
