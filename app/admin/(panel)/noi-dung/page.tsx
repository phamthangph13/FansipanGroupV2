import Link from "next/link";
import { ExternalLink, RotateCcw, Save, Sparkles, Trash2 } from "lucide-react";
import { getContentStoreUncached, getSiteUncached } from "@/lib/content";
import {
  resetAllContentEntries,
  resetContentEntry,
  saveAboutSiteAction,
  saveContentEntry,
} from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminField } from "@/components/admin/form-fields";
import { AdminNotice } from "@/components/admin/notice";

export const metadata = { title: "Selection Editor & Nội dung giới thiệu" };

export default async function ContentOverridesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const [store, site] = await Promise.all([getContentStoreUncached(), getSiteUncached()]);
  const entries = Object.entries(store.entries);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Selection Editor &amp; Giới thiệu
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Chỉnh sửa nội dung trực tiếp &amp; Phần giới thiệu
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
            Quản lý toàn bộ các nội dung đã chỉnh sửa bằng Selection Editor trên giao diện trực tiếp
            và viết lại phần giới thiệu doanh nghiệp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/vi/gioi-thieu" target="_blank" className="btn btn-outline btn-sm">
            Mở trang Giới thiệu
            <ExternalLink className="size-3.5" />
          </Link>
          <Link href="/vi" target="_blank" className="btn btn-primary btn-sm">
            <Sparkles className="size-3.5" />
            Bật Selection Editor trên trang chủ
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section id="gioi-thieu" className="border border-line bg-white xl:col-span-6">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">
              Viết lại phần Giới thiệu (Dữ liệu gốc)
            </h2>
            <p className="mt-0.5 text-[0.7rem] text-muted">
              Cập nhật trực tiếp vào trang Giới thiệu (/gioi-thieu). Bạn cũng có thể bật Selection
              Editor để click sửa trực tiếp từng đoạn ngay trên giao diện.
            </p>
          </div>
          <form action={saveAboutSiteAction} className="space-y-4 p-5">
            <AdminField
              label="Nội dung giới thiệu (Tiếng Việt)"
              htmlFor="aboutIntroVi"
              hint="Mỗi đoạn cách nhau bởi 1 dòng trống."
            >
              <textarea
                id="aboutIntroVi"
                name="aboutIntroVi"
                defaultValue={site.about.intro.vi}
                className="textarea min-h-48 text-[0.82rem] leading-relaxed"
              />
            </AdminField>
            <AdminField label="Nội dung giới thiệu (English)" htmlFor="aboutIntroEn">
              <textarea
                id="aboutIntroEn"
                name="aboutIntroEn"
                defaultValue={site.about.intro.en}
                className="textarea min-h-40 text-[0.82rem] leading-relaxed"
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Tầm nhìn (VI)" htmlFor="visionVi" hint="Mỗi ý cách 1 dòng trống.">
                <textarea
                  id="visionVi"
                  name="visionVi"
                  defaultValue={site.about.vision.map((v) => v.vi).join("\n\n")}
                  className="textarea min-h-28 text-[0.8rem]"
                />
              </AdminField>
              <AdminField label="Tầm nhìn (EN)" htmlFor="visionEn">
                <textarea
                  id="visionEn"
                  name="visionEn"
                  defaultValue={site.about.vision.map((v) => v.en).join("\n\n")}
                  className="textarea min-h-28 text-[0.8rem]"
                />
              </AdminField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Sứ mệnh (VI)" htmlFor="missionVi" hint="Mỗi ý cách 1 dòng trống.">
                <textarea
                  id="missionVi"
                  name="missionVi"
                  defaultValue={site.about.mission.map((m) => m.vi).join("\n\n")}
                  className="textarea min-h-28 text-[0.8rem]"
                />
              </AdminField>
              <AdminField label="Sứ mệnh (EN)" htmlFor="missionEn">
                <textarea
                  id="missionEn"
                  name="missionEn"
                  defaultValue={site.about.mission.map((m) => m.en).join("\n\n")}
                  className="textarea min-h-28 text-[0.8rem]"
                />
              </AdminField>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save className="size-4" />
              Lưu nội dung Giới thiệu
            </button>
          </form>
        </section>

        <section className="border border-line bg-white xl:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <div>
              <h2 className="text-[0.92rem] font-semibold text-ink">
                Nội dung đã chỉnh sửa qua Selection Editor ({entries.length})
              </h2>
              <p className="mt-0.5 text-[0.7rem] text-muted">
                Các bản ghi lưu trong MongoDB collection <code className="font-mono">content_overrides</code>.
              </p>
            </div>
            {entries.length > 0 ? (
              <form action={resetAllContentEntries}>
                <ConfirmSubmit
                  title="Khôi phục toàn bộ"
                  message="Xoá toàn bộ chỉnh sửa của Selection Editor và quay về nội dung gốc?"
                  className="btn btn-outline btn-sm text-danger hover:border-danger hover:bg-danger hover:text-white"
                >
                  <RotateCcw className="size-3.5" />
                  Khôi phục tất cả
                </ConfirmSubmit>
              </form>
            ) : null}
          </div>

          {entries.length > 0 ? (
            <ul className="divide-y divide-line">
              {entries.map(([key, val]) => (
                <li key={key} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="break-all font-mono text-[0.68rem] font-semibold text-brand">
                      {key}
                    </p>
                    <form action={resetContentEntry}>
                      <input type="hidden" name="key" value={key} />
                      <ConfirmSubmit
                        title="Khôi phục mục này"
                        message={`Xoá override cho khóa "${key}"?`}
                        className="inline-flex items-center gap-1 text-[0.7rem] text-muted transition-colors hover:text-danger"
                      >
                        <Trash2 className="size-3.5" />
                        Khôi phục gốc
                      </ConfirmSubmit>
                    </form>
                  </div>

                  <form action={saveContentEntry} className="mt-3 space-y-2.5">
                    <input type="hidden" name="key" value={key} />
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <div className="field">
                        <label className="!text-[0.68rem] !text-muted">VI</label>
                        <textarea
                          name="vi"
                          defaultValue={val.vi ?? ""}
                          className="textarea min-h-16 text-[0.78rem]"
                        />
                      </div>
                      <div className="field">
                        <label className="!text-[0.68rem] !text-muted">EN</label>
                        <textarea
                          name="en"
                          defaultValue={val.en ?? ""}
                          className="textarea min-h-16 text-[0.78rem]"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-outline btn-sm">
                      <Save className="size-3.5" />
                      Cập nhật khóa này
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center">
              <Sparkles className="mx-auto size-8 text-muted/40" />
              <p className="mt-3 text-[0.84rem] font-medium text-ink">
                Chưa có chỉnh sửa inline nào được lưu.
              </p>
              <p className="mt-1 text-[0.74rem] text-muted">
                Mở website ở góc dưới phải màn hình và nhấn “Selection Editor” để click sửa chữ, đổi
                ảnh hoặc kéo thả sắp xếp các section.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
