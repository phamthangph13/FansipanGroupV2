import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Save, Sparkles } from "lucide-react";
import { getAllArticles } from "@/lib/content";
import { articleCategories, articleCategoryLabels } from "@/lib/labels";
import { AdminEditorHeader, AdminField, LocalizedInput } from "@/components/admin/form-fields";
import { DocImporter } from "@/components/admin/doc-importer";
import { AdminNotice } from "@/components/admin/notice";
import { saveArticle } from "@/app/admin/actions";

export const metadata = { title: "Sửa bài viết" };

export default async function ArticleEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const isNew = slug === "new";
  const articles = await getAllArticles();
  const article = isNew ? undefined : articles.find((item) => item.slug === slug);

  if (!isNew && !article) notFound();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <AdminEditorHeader
        eyebrow="Tin tức"
        title={isNew ? "Viết bài mới" : "Sửa bài viết"}
        description={
          isNew
            ? "Viết trực tiếp hoặc tải file Word (.docx) / PDF lên để nạp nội dung và tự động phân loại chủ đề."
            : `Đang chỉnh sửa: ${article?.title.vi}`
        }
        backHref="/admin/tin-tuc"
        backLabel="Danh sách bài viết"
      >
        <Link href="/admin/tin-tuc" className="btn btn-outline btn-sm">
          <ArrowLeft className="size-3.5" />
          Quay lại
        </Link>
      </AdminEditorHeader>

      <div className="mt-5">
        <AdminNotice ok={sp.ok} error={sp.error} />
      </div>

      <div className="mt-4">
        <DocImporter target="article" />
      </div>

      <form action={saveArticle} className="mt-5 grid gap-5 xl:grid-cols-12">
        {article ? <input type="hidden" name="originalSlug" value={article.slug} /> : null}
        <input type="hidden" name="slug" value={article?.slug ?? ""} />
        <input
          type="hidden"
          id="sourceFile"
          name="sourceFile"
          defaultValue={article?.sourceFile ?? ""}
        />

        <div className="space-y-5 xl:col-span-8">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Nội dung bài viết</h2>
            </div>
            <div className="space-y-5 p-5">
              <LocalizedInput
                base="title"
                label="Tiêu đề"
                values={article?.title}
                required
                placeholderVi="Tiêu đề bài viết…"
                placeholderEn="Article title…"
              />
              <LocalizedInput
                base="excerpt"
                label="Mô tả ngắn"
                values={article?.excerpt}
                textarea
                hint="Hiển thị trong danh sách bài viết và phần chia sẻ. Nên dài 1–2 câu."
                placeholderVi="Tóm tắt nội dung…"
                placeholderEn="Short summary…"
              />

              <div>
                <p className="field-label">Nội dung chi tiết</p>
                <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted/70">
                  Hỗ trợ định dạng: <code className="font-mono">## Tiêu đề mục</code>,{" "}
                  <code className="font-mono">### Tiêu đề phụ</code>, dòng bắt đầu bằng{" "}
                  <code className="font-mono">- </code> cho danh sách,{" "}
                  <code className="font-mono">**chữ đậm**</code>. Cách nhau bằng một dòng trống.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="bodyVi" className="!text-[0.7rem] !font-medium !text-muted">
                      Tiếng Việt
                    </label>
                    <textarea
                      id="bodyVi"
                      name="bodyVi"
                      defaultValue={article?.body.vi ?? ""}
                      className="textarea min-h-80 font-mono text-[0.8rem] leading-relaxed"
                      placeholder={"Mở bài…\n\n## Tiêu đề mục\n\nNội dung…"}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="bodyEn" className="!text-[0.7rem] !font-medium !text-muted">
                      English
                    </label>
                    <textarea
                      id="bodyEn"
                      name="bodyEn"
                      defaultValue={article?.body.en ?? ""}
                      className="textarea min-h-80 font-mono text-[0.8rem] leading-relaxed"
                      placeholder={"Introduction…\n\n## Section heading\n\nContent…"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">
                Phân loại chủ đề &amp; thời gian
              </h2>
            </div>
            <div className="space-y-4 p-5">
              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="autoCategory"
                  defaultChecked={article?.autoCategory ?? isNew}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Sparkles className="size-3.5 text-accent" /> Tự động phân loại theo keyword
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Tự động gắn vào 1 trong 5 chủ đề cố định để tránh loãng chuyên mục.
                  </span>
                </span>
              </label>

              <AdminField label="Chuyên mục (giới hạn 5 chủ đề)" htmlFor="category">
                <select
                  id="category"
                  name="category"
                  defaultValue={article?.category ?? "tin-tuc"}
                  className="select"
                >
                  {articleCategories.map((category) => (
                    <option key={category} value={category}>
                      {articleCategoryLabels[category].vi}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField
                label="Từ khóa chính (tối đa 5 tag)"
                htmlFor="tags"
                hint="Phân cách bằng dấu phẩy. Tự động sinh từ nội dung nếu để trống."
              >
                <input
                  id="tags"
                  name="tags"
                  defaultValue={article?.tags?.join(", ") ?? ""}
                  className="input text-[0.8rem]"
                  placeholder="HVAC, Chiller, Bảo trì hệ thống"
                />
              </AdminField>

              <div className="grid grid-cols-2 gap-3">
                <AdminField label="Ngày đăng" htmlFor="date">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={article?.date ?? today}
                    className="input font-mono text-[0.78rem]"
                  />
                </AdminField>
                <AdminField label="Phút đọc" htmlFor="readingMinutes">
                  <input
                    id="readingMinutes"
                    name="readingMinutes"
                    type="number"
                    min={1}
                    max={120}
                    defaultValue={article?.readingMinutes ?? 5}
                    className="input"
                  />
                </AdminField>
              </div>

              <AdminField
                label="Đường dẫn (slug)"
                htmlFor="slugDisplay"
                hint="Tự động tạo từ tiêu đề nếu để trống."
              >
                <input
                  id="slugDisplay"
                  value={article?.slug ?? ""}
                  readOnly
                  className="input bg-cloud font-mono text-[0.74rem] text-muted"
                  placeholder="Tự động khi lưu"
                />
              </AdminField>
            </div>
          </section>

          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Hiển thị &amp; ảnh bìa</h2>
            </div>
            <div className="space-y-3 p-5">
              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={article?.published ?? false}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Eye className="size-3.5 text-brand" /> Xuất bản
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Hiển thị công khai trên website ở cả hai ngôn ngữ.
                  </span>
                </span>
              </label>
              <div className="h-px bg-line" />
              <AdminField label="Tải ảnh đại diện mới" htmlFor="imageFile">
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="input text-[0.76rem]"
                />
              </AdminField>
              <AdminField
                label="Hoặc đường dẫn ảnh đại diện"
                htmlFor="image"
                hint="Để trống sẽ dùng hình minh hoạ theo chuyên mục."
              >
                <input
                  id="image"
                  name="image"
                  defaultValue={article?.image ?? ""}
                  className="input font-mono text-[0.76rem]"
                  placeholder="/images/news/…"
                />
              </AdminField>
            </div>
          </section>

          <button type="submit" className="btn btn-primary w-full">
            <Save className="size-4" />
            {isNew ? "Tạo bài viết" : "Lưu thay đổi"}
          </button>
          <p className="text-center text-[0.66rem] text-muted/60">
            Bản nháp vẫn được lưu trong MongoDB và có thể xuất bản sau.
          </p>
        </aside>
      </form>
    </div>
  );
}
