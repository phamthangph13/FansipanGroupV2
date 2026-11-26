import { NextResponse } from "next/server";
import { recordView } from "@/lib/analytics";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limit = checkRateLimit(`track:${ip}`, 180, 60_000);
  if (!limit.ok) {
    return new NextResponse(null, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = body as {
    path?: unknown;
    locale?: unknown;
    referrer?: unknown;
    width?: unknown;
  };

  if (typeof data.path !== "string" || !data.path.startsWith("/")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (data.path.startsWith("/admin") || data.path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await recordView({
      path: data.path,
      locale: typeof data.locale === "string" ? data.locale : "vi",
      referrer: typeof data.referrer === "string" ? data.referrer : "",
      width: typeof data.width === "number" ? data.width : 0,
      userAgent: request.headers.get("user-agent") ?? "",
      ip,
    });
  } catch {
    // Analytics must never break a page view.
  }

  return new NextResponse(null, { status: 204 });
}
