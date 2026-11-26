import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { extractDocument } from "@/lib/import";
import { savePublicUpload } from "@/lib/storage";

export const runtime = "nodejs";

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
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await extractDocument(file.name, buffer);
    const saveAttachment = formData.get("saveFile") === "true";
    let fileUrl: string | null = null;
    if (saveAttachment) {
      const stored = await savePublicUpload(file, "documents", "document");
      if (stored.ok) fileUrl = stored.url;
    }

    return NextResponse.json({
      ok: true,
      fileName: file.name,
      fileUrl,
      doc,
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "extract-failed";
    return NextResponse.json({ ok: false, error: code }, { status: 422 });
  }
}
