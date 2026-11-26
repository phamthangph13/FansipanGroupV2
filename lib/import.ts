import "server-only";
import path from "path";
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";
import type { ArticleCategory, ProjectStatus, ServiceId } from "./types";

export interface ImportedDocument {
  title: string;
  body: string;
  excerpt: string;
  readingMinutes: number;
  category: ArticleCategory;
  tags: string[];
  text: string;
  pages: number | null;
  projectMeta: {
    location: string;
    client: string;
    sector: string;
    duration: string;
    year: number | null;
    status: ProjectStatus;
    categories: ServiceId[];
  };
}

const MAX_TEXT = 240_000;
const MAX_TAGS = 5;

function normalise(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Bounded 5-topic keyword dictionary so articles stay cleanly grouped without
 * creating fragmented/diluted categories.
 */
const CATEGORY_KEYWORDS: Record<ArticleCategory, string[]> = {
  "du-an": [
    "du an",
    "cong trinh",
    "nha may",
    "goi thau",
    "thi cong",
    "lap dat",
    "ban giao",
    "chiller",
    "hvac",
    "thap giai nhiet",
    "khu cong nghiep",
    "nha xuong",
    "khach san",
    "benh vien",
    "toa nha",
  ],
  "dich-vu": [
    "dich vu",
    "tu van",
    "thiet ke",
    "cung cap thiet bi",
    "van hanh",
    "bao duong",
    "bao tri",
    "sua chua",
    "cai tao",
    "nang cap",
    "khao sat",
    "quan ly du an",
  ],
  "kien-thuc": [
    "kien thuc",
    "ky thuat",
    "tieu chuan",
    "huong dan",
    "kinh nghiem",
    "giai phap",
    "tiet kiem nang luong",
    "hieu suat",
    "cop",
    "nhiet do",
    "ap suat",
    "luu luong",
    "do am",
    "tieu chuan viet nam",
    "an toan",
  ],
  "tin-tuc": [
    "tin tuc",
    "thong bao",
    "su kien",
    "hop tac",
    "ky ket",
    "ra mat",
    "chuc mung",
    "tuyen dung",
    "hoi nghi",
    "trien lam",
    "doi tac",
    "ban tin",
  ],
  "hoat-dong-noi-bo": [
    "noi bo",
    "dao tao",
    "sinh nhat",
    "team building",
    "hoi thao",
    "the thao",
    "gap mat",
    "nhan vien",
    "van hoa",
    "cong doan",
    "du lich",
    "ky niem",
    "tong ket",
    "lien hoan",
  ],
};

const CANONICAL_TAG_LABELS: { keyword: string; label: string }[] = [
  { keyword: "hvac", label: "HVAC" },
  { keyword: "chiller", label: "Chiller" },
  { keyword: "thap giai nhiet", label: "Tháp giải nhiệt" },
  { keyword: "co dien", label: "Cơ điện M&E" },
  { keyword: "bao tri", label: "Bảo trì hệ thống" },
  { keyword: "bao duong", label: "Bảo dưỡng" },
  { keyword: "nha may", label: "Nhà máy" },
  { keyword: "khu cong nghiep", label: "Khu công nghiệp" },
  { keyword: "tiet kiem nang luong", label: "Tiết kiệm năng lượng" },
  { keyword: "thi cong", label: "Thi công" },
  { keyword: "thiet ke", label: "Thiết kế" },
  { keyword: "van hanh", label: "Vận hành" },
  { keyword: "tieu chuan", label: "Tiêu chuẩn kỹ thuật" },
  { keyword: "an toan", label: "An toàn" },
  { keyword: "hop tac", label: "Hợp tác" },
  { keyword: "dao tao", label: "Đào tạo nội bộ" },
];

const SERVICE_KEYWORDS: Record<ServiceId, string[]> = {
  hvac: ["hvac", "chiller", "ahu", "fcu", "dieu hoa", "thong gio", "lam lanh", "phong sach"],
  me: ["co dien", "m&e", "tu dien", "may nen khi", "duong ong", "cap thoat nuoc", "dien dong luc"],
  cooling: ["thap giai nhiet", "cooling tower", "frp", "tam giai nhiet", "giai nhiet"],
  maintenance: ["bao tri", "bao duong", "sua chua", "cai tao", "suc rua", "van hanh"],
};

function occurrences(haystack: string, needle: string) {
  if (!needle) return 0;
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1 && count < 40) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

export function categorizeText(title: string, body: string): ArticleCategory {
  const titleText = normalise(title);
  const bodyText = normalise(body);
  let best: ArticleCategory = "tin-tuc";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    ArticleCategory,
    string[],
  ][]) {
    let score = 0;
    for (const keyword of keywords) {
      score += occurrences(titleText, keyword) * 4;
      score += occurrences(bodyText, keyword);
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  return best;
}

export function keywordTags(text: string, limit = MAX_TAGS): string[] {
  const haystack = normalise(text);
  const scored = CANONICAL_TAG_LABELS.map((item) => ({
    label: item.label,
    score: occurrences(haystack, item.keyword),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, Math.min(limit, MAX_TAGS)).map((item) => item.label);
}

function detectServiceCategories(text: string): ServiceId[] {
  const haystack = normalise(text);
  const matched: ServiceId[] = [];
  for (const [serviceId, keywords] of Object.entries(SERVICE_KEYWORDS) as [
    ServiceId,
    string[],
  ][]) {
    if (keywords.some((kw) => occurrences(haystack, kw) > 0)) {
      matched.push(serviceId);
    }
  }
  return matched;
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripTags(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function inlineHtmlToMarkdown(html: string) {
  let out = html
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, inner) => `**${stripTags(inner)}**`)
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, inner) => `**${stripTags(inner)}**`)
    .replace(/<br\s*\/?>/gi, "\n");
  out = decodeHtmlEntities(out.replace(/<[^>]+>/g, " "));
  return out
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function docxHtmlToBlocks(html: string): { title: string | null; blocks: string[] } {
  const blocks: string[] = [];
  let firstH1: string | null = null;
  const blockRegex = /<(h[1-4]|p|blockquote|ul|ol|table)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];
    if (tag === "h1") {
      const text = stripTags(inner);
      if (!text) continue;
      if (!firstH1 && blocks.length === 0) {
        firstH1 = text;
      } else {
        blocks.push(`## ${text}`);
      }
    } else if (tag === "h2") {
      const text = stripTags(inner);
      if (text) blocks.push(`## ${text}`);
    } else if (tag === "h3" || tag === "h4") {
      const text = stripTags(inner);
      if (text) blocks.push(`### ${text}`);
    } else if (tag === "blockquote") {
      const text = stripTags(inner);
      if (text) blocks.push(`> ${text}`);
    } else if (tag === "ul" || tag === "ol") {
      const items: string[] = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        const line = inlineHtmlToMarkdown(liMatch[1]).replace(/\n+/g, " ").trim();
        if (line) items.push(`- ${line}`);
      }
      if (items.length) blocks.push(items.join("\n"));
    } else if (tag === "table") {
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const rows: string[] = [];
      let rowMatch: RegExpExecArray | null;
      while ((rowMatch = rowRegex.exec(inner)) !== null) {
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        const cells: string[] = [];
        let cellMatch: RegExpExecArray | null;
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          const val = stripTags(cellMatch[1]);
          if (val) cells.push(val);
        }
        if (cells.length) rows.push(`- ${cells.join(" — ")}`);
      }
      if (rows.length) blocks.push(rows.join("\n"));
    } else {
      const text = inlineHtmlToMarkdown(inner);
      if (text) blocks.push(text);
    }
  }

  return { title: firstH1, blocks };
}

function cleanLines(raw: string) {
  const lines = raw
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim());

  return lines.filter((line, index) => {
    if (!line) return true;
    if (/^\d{1,4}$/.test(line)) return false;
    if (/^fansipan group\s*[|·-]?\s*\d{1,4}$/i.test(line)) return false;
    if (/^[•·▪◦-]$/.test(line)) return false;
    if (index === 0 && /^page \d+/i.test(line)) return false;
    return true;
  });
}

function paragraphsFrom(lines: string[]) {
  const paragraphs: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length) {
      paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim());
      current = [];
    }
  };

  for (const line of lines) {
    if (!line) {
      flush();
      continue;
    }

    if (/^[-•*]\s+/.test(line)) {
      flush();
      paragraphs.push(`- ${line.replace(/^[-•*]\s+/, "").trim()}`);
      continue;
    }

    if (current.length) {
      const previous = current[current.length - 1];
      const previousEnds = /[.!?:;]$/.test(previous);
      const lineStartsSentence = /^[A-ZÀ-Ỹ0-9"'“”‘’(]/u.test(line);
      const lineLooksShort = line.length <= 80;
      if (previousEnds && lineStartsSentence && lineLooksShort && current.length >= 2) {
        flush();
      }
    }

    current.push(line);
  }

  flush();
  return paragraphs.filter((paragraph) => paragraph.length > 0);
}

function isHeading(paragraph: string, next?: string) {
  if (paragraph.startsWith("- ") || paragraph.startsWith("## ") || paragraph.startsWith("### ")) {
    return false;
  }
  if (paragraph.length > 110) return false;
  if (/[.!?]$/.test(paragraph)) return false;
  const words = paragraph.split(/\s+/).length;
  if (words > 14) return false;
  if (!next) return words <= 8;
  return next.length > paragraph.length * 1.4;
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word.length > 2 && word === word.toLowerCase()
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word,
    )
    .join(" ");
}

function cleanFileName(fileName: string) {
  const base = path.basename(fileName, path.extname(fileName));
  const cleaned = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return titleCase(cleaned) || "Bài viết mới";
}

function buildBody(paragraphs: string[]) {
  const merged: string[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      merged.push(listBuffer.join("\n"));
      listBuffer = [];
    }
  };

  paragraphs.forEach((paragraph, index) => {
    if (paragraph.startsWith("- ")) {
      listBuffer.push(paragraph);
      return;
    }
    flushList();
    if (paragraph.startsWith("## ") || paragraph.startsWith("### ") || paragraph.startsWith("> ")) {
      merged.push(paragraph);
    } else if (isHeading(paragraph, paragraphs[index + 1])) {
      merged.push(`## ${paragraph}`);
    } else {
      merged.push(paragraph);
    }
  });

  flushList();
  return merged.join("\n\n");
}

function extractLabeledField(lines: string[], labels: string[]): string {
  for (const line of lines) {
    const clean = line.replace(/^[-•*]\s*/, "").replace(/\*\*/g, "").trim();
    const norm = normalise(clean);
    for (const label of labels) {
      if (norm.startsWith(`${label}:`) || norm.startsWith(`${label} :`)) {
        const colon = clean.indexOf(":");
        if (colon !== -1) return clean.slice(colon + 1).trim();
      }
    }
  }
  return "";
}

function extractProjectMeta(rawText: string, title: string, body: string) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const location = extractLabeledField(lines, ["dia diem", "location", "vi tri", "khu vuc"]);
  const client = extractLabeledField(lines, ["chu dau tu", "khach hang", "client", "doi tac"]);
  const sector = extractLabeledField(lines, ["linh vuc", "nganh nghe", "sector"]);
  const duration = extractLabeledField(lines, ["thoi gian", "tien do", "duration"]);
  const yearRaw = extractLabeledField(lines, ["nam", "nam thuc hien", "year"]);
  const statusRaw = normalise(extractLabeledField(lines, ["trang thai", "status"]));

  let year: number | null = null;
  if (yearRaw) {
    const m = yearRaw.match(/\b(19\d{2}|20\d{2})\b/);
    if (m) year = Number(m[1]);
  }
  if (!year) {
    const m = title.match(/\b(20\d{2})\b/);
    if (m) year = Number(m[1]);
  }

  let status: ProjectStatus = "completed";
  if (statusRaw.includes("dang") || statusRaw.includes("progress")) status = "in_progress";
  else if (statusRaw.includes("du kien") || statusRaw.includes("planned")) status = "planned";

  return {
    location,
    client,
    sector,
    duration,
    year,
    status,
    categories: detectServiceCategories(`${title} ${body}`),
  };
}

export async function extractDocument(
  fileName: string,
  buffer: Buffer,
): Promise<ImportedDocument> {
  const extension = path.extname(fileName).toLowerCase();
  let raw = "";
  let pages: number | null = null;
  let title = cleanFileName(fileName);
  let body = "";
  let plain = "";

  if (extension === ".pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const extracted = await extractText(pdf, { mergePages: true });
    raw = extracted.text.slice(0, MAX_TEXT);
    pages = extracted.totalPages;
    const lines = cleanLines(raw);
    const paragraphs = paragraphsFrom(lines);
    if (!paragraphs.length) throw new Error("empty-document");

    let bodyParagraphs = paragraphs;
    const first = paragraphs[0];
    const firstIsShort = first.length <= 140 && first.split(/\s+/).length <= 22;
    const firstIsHeading = isHeading(first, paragraphs[1]);
    if (firstIsShort && (firstIsHeading || paragraphs.length > 2)) {
      title = first;
      bodyParagraphs = paragraphs.slice(1);
    }
    body = buildBody(bodyParagraphs);
    plain = bodyParagraphs.join(" ");
  } else if (extension === ".docx") {
    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ buffer }),
      mammoth.extractRawText({ buffer }),
    ]);
    raw = textResult.value.slice(0, MAX_TEXT);
    const parsed = docxHtmlToBlocks(htmlResult.value);

    if (parsed.blocks.length > 0 || parsed.title) {
      if (parsed.title) {
        title = parsed.title;
        body = parsed.blocks.join("\n\n");
      } else {
        const first = parsed.blocks[0];
        const firstClean = first.replace(/^##\s+/, "").replace(/^###\s+/, "");
        if (firstClean.length <= 140 && parsed.blocks.length > 1) {
          title = firstClean;
          body = parsed.blocks.slice(1).join("\n\n");
        } else {
          body = parsed.blocks.join("\n\n");
        }
      }
      plain = body.replace(/^#{2,3}\s+/gm, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    } else {
      const lines = cleanLines(raw);
      const paragraphs = paragraphsFrom(lines);
      if (!paragraphs.length) throw new Error("empty-document");
      title = paragraphs[0].length <= 140 ? paragraphs[0] : title;
      const bodyParagraphs = paragraphs[0].length <= 140 && paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs;
      body = buildBody(bodyParagraphs);
      plain = bodyParagraphs.join(" ");
    }
  } else if (extension === ".txt" || extension === ".md") {
    raw = buffer.toString("utf8").slice(0, MAX_TEXT);
    const lines = cleanLines(raw);
    const paragraphs = paragraphsFrom(lines);
    if (!paragraphs.length) throw new Error("empty-document");

    let bodyParagraphs = paragraphs;
    const first = paragraphs[0].replace(/^#\s+/, "");
    if (first.length <= 140 && paragraphs.length > 1) {
      title = first;
      bodyParagraphs = paragraphs.slice(1);
    }
    body = buildBody(bodyParagraphs);
    plain = bodyParagraphs.join(" ");
  } else {
    throw new Error("unsupported-type");
  }

  if (!plain.trim() && !body.trim()) throw new Error("empty-document");

  const words = plain.split(/\s+/).filter(Boolean).length;
  const excerpt =
    plain.length <= 240
      ? plain
      : `${plain.slice(0, 237).replace(/\s+\S*$/, "").trimEnd()}…`;

  return {
    title,
    body,
    excerpt,
    readingMinutes: Math.min(120, Math.max(1, Math.ceil(words / 220))),
    category: categorizeText(title, plain),
    tags: keywordTags(`${title} ${plain}`),
    text: plain,
    pages,
    projectMeta: extractProjectMeta(raw, title, plain),
  };
}

export function detectImportType(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return [".pdf", ".docx", ".txt", ".md"].includes(extension);
}
