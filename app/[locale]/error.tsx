"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "@/components/ui/icons";

const copy = {
  vi: {
    eyebrow: "Đã xảy ra lỗi",
    title: "Không thể tải nội dung",
    body: "Có lỗi trong quá trình xử lý. Vui lòng thử lại. Nếu lỗi tiếp tục xuất hiện, hãy liên hệ Fansipan Group để được hỗ trợ.",
    retry: "Thử lại",
    home: "Về trang chủ",
    contact: "Liên hệ",
    ref: "Mã tham chiếu",
  },
  en: {
    eyebrow: "Something went wrong",
    title: "We could not load this content",
    body: "An error occurred while processing your request. Please try again. If the problem persists, contact Fansipan Group for assistance.",
    retry: "Try again",
    home: "Back to home",
    contact: "Contact us",
    ref: "Reference",
  },
} as const;

export default function LocaleError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "vi";
  const c = copy[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <section className="bg-brand-050">
      <div className="wrap pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="max-w-2xl">
          <p className="t-label flex items-center gap-2">
            <AlertTriangle className="size-4" strokeWidth={1.7} />
            {c.eyebrow}
          </p>
          <h1 className="display-1 mt-6 text-ink">{c.title}</h1>
          <p className="lead mt-6 max-w-xl">{c.body}</p>

          {digest ? (
            <p className="num mt-4 text-[0.8125rem] text-muted">
              {c.ref}: {digest}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => retry()} className="btn btn-primary">
              <RotateCcw className="size-4" />
              {c.retry}
            </button>
            <Link href={`/${locale}`} className="btn btn-outline">
              <Home className="size-4" />
              {c.home}
            </Link>
            <Link href={`/${locale}/lien-he`} className="btn btn-outline">
              {c.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
