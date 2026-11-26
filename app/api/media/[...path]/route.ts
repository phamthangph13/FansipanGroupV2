import { promises as fs } from "fs";
import path from "path";
import { collections } from "@/lib/db";
import { mimeForExt } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params;
  if (!segments || segments.length < 2) {
    return new Response("Not found", { status: 404 });
  }

  const clean = segments.map((s) => path.basename(s)).filter(Boolean);
  if (clean.length < 2) {
    return new Response("Not found", { status: 404 });
  }

  const key = `/api/media/${clean.join("/")}`;
  const legacyKey = `/uploads/${clean.join("/")}`;

  const { uploads } = await collections();
  const doc = await uploads.findOne({ id: { $in: [key, legacyKey] } });

  if (doc?.data) {
    const buffer = Buffer.from(doc.data.buffer);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": doc.contentType || mimeForExt(path.extname(clean.at(-1) || "")),
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Fallback to local public/uploads if present.
  try {
    const diskPath = path.join(process.cwd(), "public", "uploads", ...clean);
    const buffer = await fs.readFile(diskPath);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeForExt(path.extname(clean.at(-1) || "")),
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
