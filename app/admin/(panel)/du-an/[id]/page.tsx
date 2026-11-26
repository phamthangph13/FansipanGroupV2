import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, ExternalLink, EyeOff, Save, Star } from "lucide-react";
import { getProjects, getServices } from "@/lib/content";
import { projectStatusLabels } from "@/lib/labels";
import { AdminField, AdminEditorHeader, LocalizedInput } from "@/components/admin/form-fields";
import { DocImporter } from "@/components/admin/doc-importer";
import { AdminNotice } from "@/components/admin/notice";
import { saveProject } from "@/app/admin/actions";

export const metadata = { title: "Sửa dự án" };

const statuses = ["completed", "in_progress", "planned"] as const;

export default async function ProjectEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const isNew = id === "new";
  const [projects, services] = await Promise.all([getProjects(), getServices()]);
  const project = isNew ? undefined : projects.find((item) => item.id === id);

  if (!isNew && !project) notFound();

  return (
    <div>
      <AdminEditorHeader
        eyebrow="Dự án"
        title={isNew ? "Thêm dự án" : "Sửa dự án"}
        description={
          isNew
            ? "Tạo dự án mới hoặc tải file Word (.docx) / PDF chứa toàn bộ hồ sơ dự án để tự động nạp."
            : `Đang chỉnh sửa: ${project?.name}`
        }
        backHref="/admin/du-an"
        backLabel="Danh mục dự án"
      >
        <div className="flex items-center gap-2">
          {project && project.allowPublic !== false ? (
            <Link
              href={`/vi/du-an/${project.id}`}
              target="_blank"
              className="btn btn-outline btn-sm"
            >
              Xem trang Single Project
              <ExternalLink className="size-3.5" />
            </Link>
          ) : null}
          <Link href="/admin/du-an" className="btn btn-outline btn-sm">
            <ArrowLeft className="size-3.5" />
            Quay lại
          </Link>
        </div>
      </AdminEditorHeader>

      <div className="mt-5">
        <AdminNotice ok={sp.ok} error={sp.error} />
      </div>

      <div className="mt-4">
        <DocImporter target="project" />
      </div>

      <form action={saveProject} className="mt-5 grid gap-5 xl:grid-cols-12">
        {project ? <input type="hidden" name="originalId" value={project.id} /> : null}
        <input type="hidden" name="id" value={project?.id ?? ""} />

        <div className="space-y-5 xl:col-span-8">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Thông tin dự án</h2>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Tên dự án (VI)" htmlFor="name" required>
                  <input
                    id="name"
                    name="name"
                    defaultValue={project?.name ?? ""}
                    required
                    className="input"
                    placeholder="VD: Nhà máy ABC — Hệ thống chiller"
                  />
                </AdminField>
                <AdminField
                  label="Tên dự án (EN)"
                  htmlFor="nameEn"
                  hint="Để trống sẽ dùng tên tiếng Việt."
                >
                  <input
                    id="nameEn"
                    name="nameEn"
                    defaultValue={project?.nameEn ?? ""}
                    className="input"
                    placeholder="VD: ABC Factory — Chiller system"
                  />
                </AdminField>
              </div>

              <LocalizedInput
                base="scope"
                label="Phạm vi công việc (tóm tắt)"
                values={project?.scope}
                required
                textarea
                placeholderVi="Mô tả ngắn gọn hạng mục đã thực hiện…"
                placeholderEn="Brief description of the scope delivered…"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedInput
                  base="location"
                  label="Địa điểm"
                  values={project?.location}
                  placeholderVi="VD: KCN Thăng Long, Hà Nội"
                  placeholderEn="VD: Thang Long IP, Hanoi"
                />
                <div className="grid gap-4">
                  <AdminField label="Năm thực hiện" htmlFor="year" hint="Để trống nếu chưa xác nhận.">
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min={1990}
                      max={2100}
                      defaultValue={project?.year ?? ""}
                      className="input"
                      placeholder="VD: 2024"
                    />
                  </AdminField>
                  <AdminField label="Trạng thái" htmlFor="status">
                    <select
                      id="status"
                      name="status"
                      defaultValue={project?.status ?? "completed"}
                      className="select"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {projectStatusLabels[status].vi}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <LocalizedInput
                  base="client"
                  label="Chủ đầu tư / Khách hàng"
                  values={project?.client}
                  placeholderVi="Tên chủ đầu tư"
                />
                <LocalizedInput
                  base="sector"
                  label="Lĩnh vực công nghiệp"
                  values={project?.sector}
                  placeholderVi="VD: Điện tử / Dược phẩm"
                />
                <LocalizedInput
                  base="duration"
                  label="Thời gian triển khai"
                  values={project?.duration}
                  placeholderVi="VD: 03 tháng"
                />
              </div>

              <fieldset>
                <legend className="field-label">Nhóm dịch vụ</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-start gap-2.5 border border-line px-3 py-2.5 text-[0.78rem] text-ink-soft transition-colors hover:border-brand/35"
                    >
                      <input
                        type="checkbox"
                        name={`category_${service.id}`}
                        defaultChecked={project?.categories.includes(service.id) ?? false}
                        className="mt-0.5 size-4 accent-[var(--color-brand)]"
                      />
                      <span>
                        <span className="block font-medium text-ink">{service.shortTitle.vi}</span>
                        <span className="mt-0.5 block font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted/60">
                          {service.code} · {service.shortTitle.en}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <p className="field-label">Bài viết chi tiết dự án (trang Single Project)</p>
                <p className="mt-1 text-[0.68rem] text-muted/70">
                  Hỗ trợ <code className="font-mono">## Tiêu đề</code>,{" "}
                  <code className="font-mono">- danh sách</code>,{" "}
                  <code className="font-mono">**chữ đậm**</code>. Có thể nạp trực tiếp từ file Word/PDF ở trên.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="bodyVi" className="!text-[0.7rem] !font-medium !text-muted">
                      Tiếng Việt
                    </label>
                    <textarea
                      id="bodyVi"
                      name="bodyVi"
                      defaultValue={project?.body?.vi ?? ""}
                      className="textarea min-h-60 font-mono text-[0.78rem] leading-relaxed"
                      placeholder={"## Yêu cầu kỹ thuật\n\nNội dung chi tiết…"}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="bodyEn" className="!text-[0.7rem] !font-medium !text-muted">
                      English
                    </label>
                    <textarea
                      id="bodyEn"
                      name="bodyEn"
                      defaultValue={project?.body?.en ?? ""}
                      className="textarea min-h-60 font-mono text-[0.78rem] leading-relaxed"
                      placeholder={"## Technical requirements\n\nDetails…"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">
                Hình ảnh, thư viện &amp; tài liệu đính kèm
              </h2>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <AdminField label="Tải ảnh bìa dự án" htmlFor="imageFile">
                    <input
                      id="imageFile"
                      name="imageFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="input text-[0.76rem]"
                    />
                  </AdminField>
                  <AdminField label="Hoặc đường dẫn ảnh bìa" htmlFor="image">
                    <input
                      id="image"
                      name="image"
                      defaultValue={project?.image ?? ""}
                      className="input font-mono text-[0.76rem]"
                      placeholder="/images/projects/…"
                    />
                  </AdminField>
                </div>

                <div className="space-y-2">
                  <AdminField label="Tải logo khách hàng" htmlFor="clientLogoFile">
                    <input
                      id="clientLogoFile"
                      name="clientLogoFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                      className="input text-[0.76rem]"
                    />
                  </AdminField>
                  <AdminField label="Hoặc đường dẫn logo khách hàng" htmlFor="clientLogo">
                    <input
                      id="clientLogo"
                      name="clientLogo"
                      defaultValue={project?.clientLogo ?? ""}
                      className="input font-mono text-[0.76rem]"
                      placeholder="/images/clients/…"
                    />
                  </AdminField>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <AdminField label="Thêm ảnh vào thư viện (chọn nhiều ảnh)" htmlFor="galleryFiles">
                    <input
                      id="galleryFiles"
                      name="galleryFiles"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="input text-[0.76rem]"
                    />
                  </AdminField>
                  <AdminField
                    label="Danh sách URL ảnh thư viện (mỗi dòng 1 link)"
                    htmlFor="gallery"
                    className="mt-2"
                  >
                    <textarea
                      id="gallery"
                      name="gallery"
                      defaultValue={(project?.gallery ?? []).join("\n")}
                      className="textarea min-h-24 font-mono text-[0.74rem]"
                      placeholder="/uploads/projects/anh-1.jpg"
                    />
                  </AdminField>
                </div>

                <div>
                  <AdminField label="Tải tài liệu đính kèm (PDF/DOCX)" htmlFor="documentFile">
                    <input
                      id="documentFile"
                      name="documentFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="input text-[0.76rem]"
                    />
                  </AdminField>
                  <AdminField label="Tên tài liệu tải lên" htmlFor="documentTitle" className="mt-2">
                    <input
                      id="documentTitle"
                      name="documentTitle"
                      className="input text-[0.8rem]"
                      placeholder="VD: Hồ sơ nghiệm thu kỹ thuật"
                    />
                  </AdminField>
                  <AdminField
                    label="Danh sách tài liệu (Tiêu đề|URL, mỗi dòng 1 mục)"
                    htmlFor="documents"
                    className="mt-2"
                  >
                    <textarea
                      id="documents"
                      name="documents"
                      defaultValue={(project?.documents ?? [])
                        .map((d) => `${d.title}|${d.file}`)
                        .join("\n")}
                      className="textarea min-h-20 font-mono text-[0.74rem]"
                      placeholder="Bản vẽ kỹ thuật|/uploads/documents/file.pdf"
                    />
                  </AdminField>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Hiển thị</h2>
            </div>
            <div className="space-y-3 p-5">
              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={project?.featured ?? false}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Star className="size-3.5 text-brand" /> Dự án nổi bật
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Ưu tiên hiển thị trong phần dự án tiêu biểu trên trang chủ.
                  </span>
                </span>
              </label>

              <div className="h-px bg-line" />

              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="allowPublic"
                  defaultChecked={project?.allowPublic ?? true}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <EyeOff className="size-3.5 text-accent" /> Công khai trên website
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Hiển thị trong danh sách dự án và trang xem chi tiết Single Project.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="border border-line bg-navy p-5 text-white">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-white/70" />
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/65">
                Lưu ý nội dung
              </p>
            </div>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-white/70">
              Không đưa thông tin chi tiết, dữ liệu nội bộ hoặc nội dung nhạy cảm của khách hàng
              vào phần mô tả. Chỉ mô tả phạm vi công việc ở mức tổng quát.
            </p>
          </section>

          <button type="submit" className="btn btn-primary w-full">
            <Save className="size-4" />
            {isNew ? "Tạo dự án" : "Lưu thay đổi"}
          </button>
          <p className="text-center text-[0.66rem] text-muted/60">
            Thay đổi được lưu trực tiếp vào MongoDB.
          </p>
        </aside>
      </form>
    </div>
  );
}
