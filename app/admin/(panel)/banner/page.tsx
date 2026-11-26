import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Images, Plus, Save, Trash2 } from "lucide-react";
import { getAllBanners } from "@/lib/content";
import { deleteBanner, saveBanner } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminField, LocalizedInput } from "@/components/admin/form-fields";
import { AdminNotice } from "@/components/admin/notice";

export const metadata = { title: "Banner trang chủ" };

export default async function BannersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[]; edit?: string }>;
}) {
  const params = await searchParams;
  const banners = await getAllBanners();
  const editing = params.edit ? banners.find((b) => b.id === params.edit) : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Trang chủ
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Quản lý Banner Hero
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {banners.length} banner · {banners.filter((b) => b.visible).length} đang hiển thị trên
            slider trang chủ.
          </p>
        </div>
        {editing ? (
          <Link href="/admin/banner" className="btn btn-outline btn-sm">
            <Plus className="size-3.5" />
            Thêm banner mới
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-7">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">Danh sách banner</h2>
          </div>

          {banners.length ? (
            <ul className="divide-y divide-line">
              {banners.map((banner) => (
                <li
                  key={banner.id}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap"
                >
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden bg-sky">
                    <Image
                      src={banner.image}
                      alt={banner.alt.vi || banner.title.vi}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.58rem] text-muted">#{banner.order}</span>
                      <p className="truncate text-[0.86rem] font-semibold text-ink">
                        {banner.title.vi}
                      </p>
                      {banner.visible ? (
                        <span className="inline-flex items-center gap-1 bg-green/10 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-green">
                          <Eye className="size-2.5" /> Hiện
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-line px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-muted">
                          <EyeOff className="size-2.5" /> Ẩn
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[0.72rem] text-muted">
                      {banner.subtitle.vi || banner.image}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/banner?edit=${encodeURIComponent(banner.id)}`}
                      className="btn btn-outline btn-sm"
                    >
                      Sửa
                    </Link>
                    <form action={deleteBanner}>
                      <input type="hidden" name="id" value={banner.id} />
                      <ConfirmSubmit
                        title="Xoá banner"
                        message={`Xoá banner "${banner.title.vi}"?`}
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
              <Images className="mx-auto size-8 text-muted/40" />
              <p className="mt-3 text-[0.82rem] text-muted">Chưa có banner nào.</p>
            </div>
          )}
        </section>

        <section className="border border-line bg-white xl:col-span-5">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">
              {editing ? `Sửa banner: ${editing.title.vi}` : "Thêm banner mới"}
            </h2>
          </div>

          <form key={editing?.id ?? "new"} action={saveBanner} className="space-y-4 p-5">
            {editing ? <input type="hidden" name="originalId" value={editing.id} /> : null}

            <LocalizedInput
              base="title"
              label="Tiêu đề banner"
              values={editing?.title}
              required
              placeholderVi="VD: Hệ thống tháp giải nhiệt"
              placeholderEn="VD: Cooling tower systems"
            />

            <LocalizedInput
              base="subtitle"
              label="Mô tả ngắn"
              values={editing?.subtitle}
              textarea
              placeholderVi="Mô tả ngắn gọn…"
              placeholderEn="Short description…"
            />

            <AdminField
              label="Tải ảnh banner lên"
              htmlFor="imageFile"
              hint="Hỗ trợ JPG, PNG, WEBP, AVIF tối đa 10 MB."
            >
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                className="input text-[0.76rem]"
              />
            </AdminField>

            <AdminField
              label="Hoặc đường dẫn ảnh hiện có"
              htmlFor="image"
              hint="VD: /images/about/cooling.jpg"
            >
              <input
                id="image"
                name="image"
                defaultValue={editing?.image ?? ""}
                className="input font-mono text-[0.76rem]"
                placeholder="/images/about/…"
              />
            </AdminField>

            <LocalizedInput
              base="alt"
              label="Mô tả ảnh (alt)"
              values={editing?.alt}
              placeholderVi="Mô tả nội dung ảnh…"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Liên kết nút bấm" htmlFor="href">
                <input
                  id="href"
                  name="href"
                  defaultValue={editing?.href ?? "/vi/lien-he#quote"}
                  className="input font-mono text-[0.76rem]"
                />
              </AdminField>
              <AdminField label="Thứ tự hiển thị" htmlFor="order">
                <input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  defaultValue={editing?.order ?? banners.length + 1}
                  className="input"
                />
              </AdminField>
            </div>

            <LocalizedInput
              base="ctaLabel"
              label="Nhãn nút (CTA)"
              values={editing?.ctaLabel}
              placeholderVi="Yêu cầu khảo sát"
              placeholderEn="Request a survey"
            />

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
              {editing ? "Cập nhật banner" : "Thêm banner"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
