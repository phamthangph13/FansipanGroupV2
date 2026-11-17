import { redirect } from "next/navigation";
import Image from "next/image";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Đăng nhập quản trị",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative flex items-center gap-3">
          <Image src="/brand/mark-white.png" alt="" width={42} height={42} priority />
          <div>
            <p className="text-[0.82rem] font-semibold tracking-[0.04em]">FANSIPAN GROUP.,JSC</p>
            <p className="mt-0.5 text-[0.8125rem] text-white/75">
              M&amp;E · HVAC · Industrial services
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-[1rem] text-white/75">Hệ thống quản trị nội dung</p>
          <h1 className="display-2 mt-4">
            Quản lý nội dung website, yêu cầu và hồ sơ ứng tuyển.
          </h1>
          <p className="mt-6 text-[1rem] leading-relaxed text-white/80">
            Khu vực nội bộ dành cho người được cấp quyền. Mọi thay đổi được lưu trực tiếp vào
            nguồn nội dung của website.
          </p>
        </div>

        <p className="relative text-[0.8125rem] text-white/65">
          fansipan-group.vn · Internal
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/brand/mark.png" alt="" width={48} height={48} priority />
            <span className="text-[0.8rem] font-semibold text-ink">FANSIPAN GROUP.,JSC</span>
          </div>

          <p className="mt-8 font-display text-[1rem] text-muted lg:mt-0">
            Khu vực quản trị
          </p>
          <h2 className="display-3 mt-3 text-ink">Đăng nhập</h2>
          <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
            Nhập mật khẩu quản trị để tiếp tục. Phiên đăng nhập có hiệu lực trong 12 giờ.
          </p>

          <LoginForm />

          <p className="mt-8 text-[0.8125rem] leading-relaxed text-muted">
            Chỉ dành cho người được cấp quyền. Nếu bạn không phải quản trị viên, vui lòng quay lại{" "}
            <a href="/vi" className="font-medium text-brand underline underline-offset-2">
              website
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
