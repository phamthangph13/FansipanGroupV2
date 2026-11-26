import { NextResponse, type NextRequest } from "next/server";
import { adminLoginPath } from "@/lib/admin-path";
import { defaultLocale, locales } from "@/lib/i18n";

const PUBLIC_FILE =
  /\.(?:png|jpe?g|gif|svg|webp|avif|ico|pdf|html?|txt|xml|json|webmanifest|mjs|woff2?|ttf|otf|mp4|webm)$/i;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginPath = adminLoginPath();

  // Secret administrator entry. The URL is never linked from the website.
  if (pathname === loginPath || pathname === `${loginPath}/`) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.rewrite(url, {
      request: { headers: new Headers(request.headers) },
    });
  }

  // The real login route stays hidden. Only the rewrite above may reach it.
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // Unauthenticated probes to /admin also return 404 so the hidden login path is never leaked.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = Boolean(request.cookies.get("fsg_admin")?.value);
    if (!hasSession) {
      return new NextResponse("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
      });
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/pdf/")
  ) {
    return NextResponse.next();
  }

  const segment = pathname.split("/").filter(Boolean)[0];

  if (locales.includes(segment as (typeof locales)[number])) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", segment as string);
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|images|catalogue|uploads).*)"],
};
