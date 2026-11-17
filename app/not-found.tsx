import Link from "next/link";
import { headers } from "next/headers";
import { Logo } from "@/components/brand/logo";
import { NotFoundView } from "@/components/layout/not-found-view";

export default async function GlobalNotFound() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") === "en" ? "en" : "vi";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="wrap flex h-24 items-center justify-between gap-6">
          <Link href={`/${locale}`} aria-label="Fansipan Group">
            <Logo size="md" variant="dark" />
          </Link>
          <Link href={`/${locale}`} className="link-arrow">
            {locale === "en" ? "Back to home" : "Về trang chủ"}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <NotFoundView locale={locale} />
      </main>

      <footer className="bg-sky-2">
        <div className="wrap flex flex-col gap-2 py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Công ty cổ phần Fansipan Group</p>
          <p>fansipan-group.vn</p>
        </div>
      </footer>
    </div>
  );
}
