import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { savePublicUpload } from "@/lib/storage";

export const runtime = "nodejs";

const VALID_FOLDERS = new Set([
  "banners",
  "partners",
  "capabilities",
  "projects",
  "news",
  "documents",
  "editor",
]);

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "missing-file" }, { status: 400 });
  }

  const folderRaw = String(formData.get("folder") ?? "editor");
  const folder = (VALID_FOLDERS.has(folderRaw) ? folderRaw : "editor") as
    | "banners"
    | "partners"
    | "capabilities"
    | "projects"
    | "news"
    | "documents"
    | "editor";
  const kind = formData.get("kind") === "document" ? "document" : "image";

  const stored = await savePublicUpload(file, folder, kind);
  if (!stored.ok) {
    return NextResponse.json(
      { ok: false, error: stored.error === "size" ? "too-large" : "invalid-type" },
      { status: stored.error === "size" ? 413 : 415 },
    );
  }

  return NextResponse.json({ ok: true, url: stored.url });
}
