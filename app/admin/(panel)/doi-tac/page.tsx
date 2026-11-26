import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Handshake, Plus, Save, Trash2 } from "lucide-react";
import { getAllPartners } from "@/lib/content";
import { deletePartner, savePartner } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminField } from "@/components/admin/form-fields";
import { AdminNotice } from "@/components/admin/notice";

export const metadata = { title: "Khách hàng & Đối tác" };

export default async function PartnersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[]; edit?: string }>;
}) {
  const params = await searchParams;
  const partners = await getAllPartners();
  const editing = params.edit ? partners.find((p) => p.id === params.edit) : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Khách hàng &amp; đối tác
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Quản lý Đối tác
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {partners.length} đối tác · {partners.filter((p) => p.visible).length} đang hiển thị.
          </p>
        </div>
        {editing ? (
          <Link href="/admin/doi-tac" className="btn btn-outline btn-sm">
            <Plus className="size-3.5" />
            Thêm đối tác mới
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-7">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">Danh sách đối tác</h2>
          </div>

          {partners.length ? (
            <ul className="divide-y divide-line">
              {partners.map((partner) => (
                <li key={partner.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="relative flex h-11 w-20 shrink-0 items-center justify-center border border-line bg-cloud p-1.5">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <Handshake className="size-4 text-muted/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.58rem] text-muted">#{partner.order}</span>
                      <p className="truncate text-[0.86rem] font-semibold text-ink">
                        {partner.name}
                      </p>
                      {partner.visible ? (
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
                      {partner.url || partner.logo || "Hiển thị dạng tên thương hiệu"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/doi-tac?edit=${encodeURIComponent(partner.id)}`}
                      className="btn btn-outline btn-sm"
                    >
                      Sửa
                    </Link>
                    <form action={deletePartner}>
                      <input type="hidden" name="id" value={partner.id} />
                      <ConfirmSubmit
                        title="Xoá đối tác"
                        message={`Xoá đối tác "${partner.name}"?`}
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
              <Handshake className="mx-auto size-8 text-muted/40" />
              <p className="mt-3 text-[0.82rem] text-muted">Chưa có đối tác nào.</p>
            </div>
          )}
        </section>

        <section className="border border-line bg-white xl:col-span-5">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[0.92rem] font-semibold text-ink">
              {editing ? `Sửa đối tác: ${editing.name}` : "Thêm đối tác mới"}
            </h2>
          </div>

          <form key={editing?.id ?? "new"} action={savePartner} className="space-y-4 p-5">
            {editing ? <input type="hidden" name="originalId" value={editing.id} /> : null}

            <AdminField label="Tên đối tác / khách hàng" htmlFor="name" required>
              <input
                id="name"
                name="name"
                defaultValue={editing?.name ?? ""}
                required
                className="input"
                placeholder="VD: Panasonic"
              />
            </AdminField>

            <AdminField label="Tải logo lên" htmlFor="logoFile">
              <input
                id="logoFile"
                name="logoFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                className="input text-[0.76rem]"
              />
            </AdminField>

            <AdminField label="Hoặc đường dẫn logo" htmlFor="logo">
              <input
                id="logo"
                name="logo"
                defaultValue={editing?.logo ?? ""}
                className="input font-mono text-[0.76rem]"
                placeholder="/images/clients/…"
              />
            </AdminField>

            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Website đối tác" htmlFor="url">
                <input
                  id="url"
                  name="url"
                  defaultValue={editing?.url ?? ""}
                  className="input font-mono text-[0.76rem]"
                  placeholder="https://…"
                />
              </AdminField>
              <AdminField label="Thứ tự" htmlFor="order">
                <input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  defaultValue={editing?.order ?? partners.length + 1}
                  className="input"
                />
              </AdminField>
            </div>

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
              {editing ? "Cập nhật đối tác" : "Thêm đối tác"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
