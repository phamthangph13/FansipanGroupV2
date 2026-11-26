import Link from "next/link";
import { ExternalLink, Eye, EyeOff, FileCheck2, Plus, Save, Trash2 } from "lucide-react";
import { getAllCapabilityDocs } from "@/lib/content";
import { deleteCapability, saveCapability } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminField, LocalizedInput } from "@/components/admin/form-fields";
import { AdminNotice } from "@/components/admin/notice";

export const metadata = { title: "Hồ sơ năng lực" };

const kindLabels: Record<string, string> = {
  profile: "Hồ sơ năng lực chính",
  brochure: "Brochure / Catalogue",
  certificate: "Chứng chỉ",
  other: "Tài liệu khác",
};

export default async function CapabilitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[]; edit?: string }>;
}) {
  const params = await searchParams;
  const docs = await getAllCapabilityDocs();
  const editing = params.edit ? docs.find((d) => d.id === params.edit) : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Tài liệu doanh nghiệp
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Quản lý Hồ sơ năng lực
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            Tài liệu loại “Hồ sơ năng lực chính” đang bật sẽ hiển thị trên trình đọc sách lật trang
            và nút tải PDF.
          </p>
        </div>
        {editing ? (
          <Link href="/admin/ho-so" className="btn btn-outline btn-sm">
            <Plus className="size-3.5" />
            Thêm tài liệu mới
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-7">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">Danh sách hồ sơ &amp; tài liệu</h2>
          </div>

          {docs.length ? (
            <ul className="divide-y divide-line">
              {docs.map((doc) => (
                <li key={doc.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center bg-brand-050 text-brand">
                    <FileCheck2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.58rem] text-muted">#{doc.order}</span>
                      <p className="truncate text-[0.86rem] font-semibold text-ink">
                        {doc.title.vi}
                      </p>
                      <span className="bg-brand-050 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-brand">
                        {kindLabels[doc.kind] ?? doc.kind}
                      </span>
                      {doc.visible ? (
                        <span className="inline-flex items-center gap-1 bg-green/10 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-green">
                          <Eye className="size-2.5" /> Hiện
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-line px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-muted">
                          <EyeOff className="size-2.5" /> Ẩn
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[0.68rem] text-muted">
                      {doc.file}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex size-9 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                      aria-label={`Mở ${doc.title.vi}`}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <Link
                      href={`/admin/ho-so?edit=${encodeURIComponent(doc.id)}`}
                      className="btn btn-outline btn-sm"
                    >
                      Sửa
                    </Link>
                    <form action={deleteCapability}>
                      <input type="hidden" name="id" value={doc.id} />
                      <ConfirmSubmit
                        title="Xoá tài liệu"
                        message={`Xoá tài liệu "${doc.title.vi}"?`}
                        className="flex size-9 items-center justify-center border border-line text-muted transition-colors hover:border-danger/40 hover:text-danger"
                      >
                        <Trash2 className="size-3.5" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center">
              <FileCheck2 className="mx-auto size-8 text-muted/40" />
              <p className="mt-3 text-[0.82rem] text-muted">Chưa có tài liệu nào.</p>
            </div>
          )}
        </section>

        <section className="border border-line bg-white xl:col-span-5">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">
              {editing ? `Sửa tài liệu: ${editing.title.vi}` : "Thêm hồ sơ năng lực"}
            </h2>
          </div>

          <form key={editing?.id ?? "new"} action={saveCapability} className="space-y-4 p-5">
            {editing ? <input type="hidden" name="originalId" value={editing.id} /> : null}

            <LocalizedInput
              base="title"
              label="Tiêu đề tài liệu"
              values={editing?.title}
              required
              placeholderVi="Hồ sơ năng lực Fansipan Group"
              placeholderEn="Fansipan Group company profile"
            />

            <LocalizedInput
              base="description"
              label="Mô tả ngắn"
              values={editing?.description}
              textarea
              placeholderVi="Tóm tắt nội dung tài liệu…"
              placeholderEn="Short summary…"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Loại tài liệu" htmlFor="kind">
                <select
                  id="kind"
                  name="kind"
                  defaultValue={editing?.kind ?? "profile"}
                  className="select"
                >
                  <option value="profile">Hồ sơ năng lực chính</option>
                  <option value="brochure">Brochure / Catalogue</option>
                  <option value="certificate">Chứng chỉ</option>
                  <option value="other">Tài liệu khác</option>
                </select>
              </AdminField>
              <AdminField label="Thứ tự" htmlFor="order">
                <input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  defaultValue={editing?.order ?? docs.length + 1}
                  className="input"
                />
              </AdminField>
            </div>

            <AdminField
              label="Tải tệp PDF / DOCX lên"
              htmlFor="fileUpload"
              hint="Hỗ trợ PDF, DOC, DOCX tối đa 25 MB."
            >
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="input text-[0.76rem]"
              />
            </AdminField>

            <AdminField label="Hoặc đường dẫn tệp hiện có" htmlFor="file">
              <input
                id="file"
                name="file"
                defaultValue={editing?.file ?? ""}
                className="input font-mono text-[0.76rem]"
                placeholder="/catalogue/fansipan-group-profile.pdf"
              />
            </AdminField>

            <AdminField label="Ảnh bìa (tuỳ chọn)" htmlFor="coverFile">
              <input
                id="coverFile"
                name="coverFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="input text-[0.76rem]"
              />
            </AdminField>
            <input type="hidden" name="cover" value={editing?.cover ?? ""} />

            <label className="checkbox-row cursor-pointer pt-1">
              <input
                type="checkbox"
                name="visible"
                defaultChecked={editing?.visible ?? true}
                className="accent-[var(--color-brand)]"
              />
              <span className="text-[0.8rem] font-medium text-ink">Hiển thị trên website</span>
            </label>

            <button type="submit" className="btn btn-primary w-full">
              <Save className="size-4" />
              {editing ? "Cập nhật tài liệu" : "Thêm tài liệu"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
