import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getSiteUncached, saveSiteData } from "@/lib/content";
import type { SiteData } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const site = await getSiteUncached();
  return NextResponse.json({
    ok: true,
    sections: site.homeSections.map((section) => ({
      id: section.id,
      enabled: section.enabled,
      label: section.label,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = body as { order?: unknown; toggle?: unknown };
  const site = await getSiteUncached();
  let sections = [...site.homeSections];

  if (Array.isArray(data.order)) {
    const order = data.order.filter((id): id is string => typeof id === "string");
    const byId = new Map<string, SiteData["homeSections"][number]>(
      sections.map((section) => [section.id, section]),
    );
    const ordered = order
      .map((id) => byId.get(id))
      .filter((section): section is SiteData["homeSections"][number] => Boolean(section));
    const remaining = sections.filter((section) => !order.includes(section.id));
    sections = [...ordered, ...remaining];
  }

  if (typeof data.toggle === "string") {
    sections = sections.map((section) =>
      section.id === data.toggle ? { ...section, enabled: !section.enabled } : section,
    );
  }

  await saveSiteData({ ...site, homeSections: sections });
  revalidatePath("/", "layout");
  revalidatePath("/admin/trang-chu");
  return NextResponse.json({ ok: true, sections });
}
