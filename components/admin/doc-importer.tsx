"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import type { ImportedDocument } from "@/lib/import";
import { articleCategoryLabels } from "@/lib/labels";

interface ImportResponse {
  ok: boolean;
  fileName?: string;
  fileUrl?: string | null;
  doc?: ImportedDocument;
  error?: string;
}

function setFieldValue(id: string, val: string) {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (!el) return;
  el.value = val;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function setCheckbox(name: string, checked: boolean) {
  const el = document.querySelector(`input[type="checkbox"][name="${name}"]`) as HTMLInputElement | null;
  if (el) el.checked = checked;
}

export function DocImporter({ target }: { target: "article" | "project" }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (target === "project") formData.append("saveFile", "true");

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as ImportResponse;
      if (!res.ok || !data.ok || !data.doc) {
        setError("Không thể trích xuất nội dung. Hỗ trợ .docx, .pdf, .txt, .md (tối đa 25 MB).");
        return;
      }

      const { doc } = data;
      if (target === "article") {
        setFieldValue("titleVi", doc.title);
        setFieldValue("excerptVi", doc.excerpt);
        setFieldValue("bodyVi", doc.body);
        setFieldValue("readingMinutes", String(doc.readingMinutes));
        setFieldValue("category", doc.category);
        setFieldValue("tags", doc.tags.join(", "));
        setFieldValue("sourceFile", data.fileName ?? file.name);
        setCheckbox("autoCategory", true);
        setStatus(
          `Đã nạp "${data.fileName}" · Tự động phân loại: ${articleCategoryLabels[doc.category].vi} (${doc.tags.join(", ") || "không có tag"}).`,
        );
      } else {
        setFieldValue("name", doc.title);
        setFieldValue("scopeVi", doc.excerpt);
        setFieldValue("bodyVi", doc.body);
        if (doc.projectMeta.location) setFieldValue("locationVi", doc.projectMeta.location);
        if (doc.projectMeta.client) setFieldValue("clientVi", doc.projectMeta.client);
        if (doc.projectMeta.sector) setFieldValue("sectorVi", doc.projectMeta.sector);
        if (doc.projectMeta.duration) setFieldValue("durationVi", doc.projectMeta.duration);
        if (doc.projectMeta.year) setFieldValue("year", String(doc.projectMeta.year));
        setFieldValue("status", doc.projectMeta.status);
        for (const cat of ["hvac", "me", "cooling", "maintenance"] as const) {
          setCheckbox(`category_${cat}`, doc.projectMeta.categories.includes(cat));
        }
        if (data.fileUrl) {
          const docsEl = document.getElementById("documents") as HTMLTextAreaElement | null;
          const existing = docsEl?.value.trim() ?? "";
          const line = `${doc.title}|${data.fileUrl}`;
          setFieldValue("documents", existing ? `${existing}\n${line}` : line);
        }
        setStatus(`Đã nạp nội dung dự án từ "${data.fileName}". Kiểm tra lại và nhấn Lưu.`);
      }
    } catch {
      setError("Lỗi kết nối khi đọc tệp.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-brand/25 bg-brand-050/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-ink">
            <Sparkles className="size-4 text-accent" />
            Nạp nhanh từ file Word (.docx) hoặc PDF (.pdf)
          </p>
          <p className="mt-0.5 text-[0.72rem] text-muted">
            {target === "article"
              ? "Tự động tách tiêu đề, tóm tắt, nội dung và phân loại vào 5 chủ đề chuẩn theo từ khóa."
              : "Tự động điền tên dự án, phạm vi, mô tả chi tiết, đính kèm tài liệu gốc và nhận diện lĩnh vực."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn btn-outline btn-sm bg-white"
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <FileUp className="size-3.5" />}
          {busy ? "Đang đọc tệp…" : "Chọn file .docx / .pdf"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,.pdf,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />

      {status ? (
        <p className="mt-3 border border-green/25 bg-white px-3 py-2 text-[0.74rem] text-green">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 border border-danger/25 bg-white px-3 py-2 text-[0.74rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
