import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import {
  deleteContentOverride,
  getContentStoreUncached,
  setContentOverride,
} from "@/lib/content";

export const runtime = "nodejs";

const MAX_KEY = 500;
const MAX_VALUE = 20000;

function validKey(key: string) {
  if (!key || key.length > MAX_KEY) return false;
  if (/[\u0000-\u001f]/.test(key)) return false;
  return true;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const store = await getContentStoreUncached();
  return NextResponse.json({ ok: true, ...store });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const data = body as {
    key?: unknown;
    locale?: unknown;
    value?: unknown;
    reset?: unknown;
  };

  if (typeof data.key !== "string" || !validKey(data.key)) {
    return NextResponse.json({ ok: false, error: "invalid-key" }, { status: 400 });
  }
  const locale = data.locale === "en" ? "en" : data.locale === "vi" ? "vi" : null;
  const reset = data.reset === true;
  if (!reset && (!locale || typeof data.value !== "string" || data.value.length > MAX_VALUE)) {
    return NextResponse.json({ ok: false, error: "invalid-value" }, { status: 400 });
  }

  try {
    if (reset) {
      await deleteContentOverride(data.key);
    } else {
      await setContentOverride(data.key, locale as "vi" | "en", data.value as string);
    }
    revalidatePath("/", "layout");
  } catch {
    return NextResponse.json({ ok: false, error: "write-failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
