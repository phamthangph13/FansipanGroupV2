import Link from "next/link";
import { ArrowRight, FileUp, Newspaper, Building2 } from "lucide-react";
import { articleCategories, articleCategoryLabels } from "@/lib/labels";
import { importDocumentAction } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/form-fields";
import { AdminNotice } from "@/components/admin/notice";

export const metadata = { title: "Nhập tài liệu (DOCX / PDF)" };

export default async function ImportDocPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Tự động hóa nội dung
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Nhập bài từ file Word (.docx) hoặc PDF
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
            Viết toàn bộ bài tin tức hoặc hồ sơ dự án trong Word/PDF rồi tải lên. Hệ thống tự động
            trích xuất tiêu đề, định dạng mục lục, tóm tắt và phân loại theo từ khóa (giới hạn 5 chủ
            đề chính để tránh loãng).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/tin-tuc" className="btn btn-outline btn-sm">
            <Newspaper className="size-3.5" />
            Tin tức
          </Link>
          <Link href="/admin/du-an" className="btn btn-outline btn-sm">
            <Building2 className="size-3.5" />
            Dự án
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <form
          action={importDocumentAction}
          className="space-y-5 border border-line bg-white p-5 xl:col-span-8"
        >
          <AdminField
            label="Chọn tệp tài liệu (.docx, .pdf, .txt, .md)"
            htmlFor="file"
            required
            hint="Dung lượng tối đa 25 MB. Hỗ trợ định dạng tiêu đề, danh sách và chữ đậm từ Word."
          >
            <input
              id="file"
              name="file"
              type="file"
              required
              accept=".docx,.pdf,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="input text-[0.8rem]"
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Đích nhập liệu" htmlFor="target">
              <select id="target" name="target" defaultValue="article" className="select">
                <option value="article">Tin tức / Bài viết</option>
                <option value="project">Dự án (Single Project)</option>
              </select>
            </AdminField>

            <AdminField
              label="Chủ đề tin tức (giới hạn 5 chủ đề)"
              htmlFor="category"
              hint="Mặc định tự động nhận diện theo từ khóa trong nội dung."
            >
              <select id="category" name="category" defaultValue="auto" className="select">
                <option value="auto">Tự động phân loại theo từ khóa</option>
                {articleCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {articleCategoryLabels[cat].vi}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <AdminField
            label="Tiêu đề tùy chỉnh (tuỳ chọn)"
            htmlFor="title"
            hint="Để trống nếu muốn hệ thống tự lấy tiêu đề từ dòng đầu tiên hoặc tên tệp."
          >
            <input
              id="title"
              name="title"
              className="input"
              placeholder="Để trống để tự động nhận diện…"
            />
          </AdminField>

          <AdminField
            label="Tóm tắt tùy chỉnh (tuỳ chọn)"
            htmlFor="excerpt"
            hint="Để trống sẽ tự động trích đoạn mở đầu."
          >
            <textarea
              id="excerpt"
              name="excerpt"
              className="textarea min-h-20 text-[0.84rem]"
              placeholder="Để trống để tự động tạo tóm tắt…"
            />
          </AdminField>

          <label className="checkbox-row cursor-pointer">
            <input
              type="checkbox"
              name="published"
              className="accent-[var(--color-brand)]"
            />
            <span>
              <span className="block text-[0.82rem] font-medium text-ink">
                Xuất bản / Công khai ngay sau khi nhập
              </span>
              <span className="mt-0.5 block text-[0.7rem] text-muted">
                Nếu bỏ chọn, bài viết sẽ ở trạng thái Nháp (hoặc Dự án ẩn) để bạn kiểm tra lại
                trước khi công khai.
              </span>
            </span>
          </label>

          <button type="submit" className="btn btn-primary">
            <FileUp className="size-4" />
            Tải lên &amp; Tạo bài trong MongoDB
            <ArrowRight className="size-4" />
          </button>
        </form>

        <aside className="space-y-4 xl:col-span-4">
          <div className="border border-line bg-white p-5">
            <h2 className="text-[0.92rem] font-semibold text-ink">
              5 chủ đề giới hạn tránh loãng
            </h2>
            <p className="mt-1.5 text-[0.74rem] leading-relaxed text-muted">
              Hệ thống tự động chấm điểm từ khóa trong tiêu đề và nội dung để gán chính xác vào 1
              trong 5 chủ đề cố định:
            </p>
            <ul className="mt-3 space-y-2 text-[0.76rem] text-ink-soft">
              {articleCategories.map((cat) => (
                <li key={cat} className="flex items-center justify-between border-b border-line/70 pb-1.5">
                  <span className="font-medium text-ink">{articleCategoryLabels[cat].vi}</span>
                  <span className="font-mono text-[0.64rem] text-muted">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-line bg-navy p-5 text-white">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/65">
              Mẹo nhập Dự án từ Word / PDF
            </p>
            <p className="mt-2.5 text-[0.74rem] leading-relaxed text-white/75">
              Nếu file dự án có các dòng như <code className="font-mono">Địa điểm: ...</code>,{" "}
              <code className="font-mono">Chủ đầu tư: ...</code>,{" "}
              <code className="font-mono">Lĩnh vực: ...</code>,{" "}
              <code className="font-mono">Năm: ...</code>,{" "}
              <code className="font-mono">Thời gian: ...</code>, hệ thống sẽ tự điền các trường
              tương ứng và đính kèm luôn file gốc vào trang Single Project.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
