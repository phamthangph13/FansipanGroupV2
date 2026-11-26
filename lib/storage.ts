import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Binary } from "mongodb";
import { collections } from "./db";
import { sanitizeFileName } from "./utils";

const uploadsDir = path.join(process.cwd(), "data", "uploads", "applications");
const ALLOWED = new Map<string, string[]>([
  ["application/pdf", [".pdf"]],
  ["application/msword", [".doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [".docx"],
  ],
]);
const ALLOWED_EXT = [".pdf", ".doc", ".docx"];
const MAX_SIZE = 5 * 1024 * 1024;

export function mimeForExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

export async function saveCv(file: File, id: string) {
  if (!file || file.size === 0) return { ok: true as const, stored: null, original: null };
  if (file.size > MAX_SIZE) return { ok: false as const, error: "size" };

  const ext = path.extname(file.name).toLowerCase();
  const typeAllowed = ALLOWED.get(file.type)?.includes(ext) ?? false;
  if (!ALLOWED_EXT.includes(ext) || (file.type && !typeAllowed)) {
    return { ok: false as const, error: "type" };
  }

  const safe = sanitizeFileName(path.basename(file.name, ext)) || "cv";
  const stored = `${id}-${safe}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Persist binary in MongoDB first (works on read-only serverless environments like Vercel).
  const { uploads } = await collections();
  await uploads.replaceOne(
    { id: `cv:${stored}` },
    {
      id: `cv:${stored}`,
      folder: "applications",
      filename: file.name,
      contentType: file.type || mimeForExt(ext),
      size: buffer.length,
      data: new Binary(buffer),
      createdAt: new Date().toISOString(),
    },
    { upsert: true },
  );

  // Best-effort local disk copy when filesystem is writable.
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, stored), buffer);
  } catch {
    // Ignore read-only filesystem errors in serverless environments.
  }

  return { ok: true as const, stored, original: file.name };
}

export async function readCv(stored: string) {
  const safe = path.basename(stored);
  const full = path.join(uploadsDir, safe);

  const { uploads } = await collections();
  const doc = await uploads.findOne({ id: `cv:${safe}` });
  if (doc?.data) {
    return { buffer: Buffer.from(doc.data.buffer), full };
  }

  const buffer = await fs.readFile(full);
  return { buffer, full };
}

export async function deleteCv(stored: string | null) {
  if (!stored) return;
  const safe = path.basename(stored);
  try {
    const { uploads } = await collections();
    await uploads.deleteOne({ id: `cv:${safe}` });
  } catch {
    // Ignore DB cleanup errors.
  }
  try {
    await fs.unlink(path.join(uploadsDir, safe));
  } catch {
    // File may not exist on serverless disk.
  }
}

export const CV_MAX_SIZE = MAX_SIZE;

/* --------------------------------------------------- Public admin uploads */

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"];
const DOCUMENT_EXT = [".pdf", ".doc", ".docx"];
const publicUploadsDir = path.join(process.cwd(), "public", "uploads");

export async function savePublicUpload(
  file: File,
  folder: "banners" | "partners" | "capabilities" | "projects" | "news" | "documents" | "editor",
  kind: "image" | "document",
): Promise<{ ok: true; url: string } | { ok: false; error: "size" | "type" }> {
  // Keep within MongoDB 16 MB BSON document limit.
  const limit = kind === "image" ? 10 * 1024 * 1024 : 14 * 1024 * 1024;
  if (file.size === 0) return { ok: false, error: "type" };
  if (file.size > limit) return { ok: false, error: "size" };

  const ext = path.extname(file.name).toLowerCase();
  const allowed = kind === "image" ? IMAGE_EXT : DOCUMENT_EXT;
  if (!allowed.includes(ext)) return { ok: false, error: "type" };

  const base = sanitizeFileName(path.basename(file.name, ext)) || "file";
  const stored = `${Date.now().toString(36)}-${base.slice(0, 60)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = `/api/media/${folder}/${stored}`;
  const legacyKey = `/uploads/${folder}/${stored}`;

  const { uploads } = await collections();
  await uploads.replaceOne(
    { id: url },
    {
      id: url,
      folder,
      filename: file.name,
      contentType: file.type || mimeForExt(ext),
      size: buffer.length,
      data: new Binary(buffer),
      createdAt: new Date().toISOString(),
    },
    { upsert: true },
  );

  // Best-effort local disk copy.
  try {
    const directory = path.join(publicUploadsDir, folder);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, stored), buffer);
  } catch {
    // Ignore read-only filesystem errors in serverless environments.
  }

  void legacyKey;
  return { ok: true, url };
}
