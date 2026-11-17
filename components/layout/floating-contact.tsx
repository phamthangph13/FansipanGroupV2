"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  Chat,
  Facebook,
  Phone,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function FloatingContact({ site, locale }: { site: SiteData; locale: Locale }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={locale === "vi" ? "Lên đầu trang" : "Back to top"}
        className={cn(
          "flex size-11 items-center justify-center border border-line bg-white text-ink transition-all duration-300 hover:border-brand hover:text-brand",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowDown className="size-4 rotate-180" />
      </button>

      <a
        href={`https://zalo.me/${site.contact.zalo}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={locale === "vi" ? "Chat Zalo 0913 339 190" : "Chat on Zalo 0913 339 190"}
        className="group flex h-11 items-center gap-0 overflow-hidden bg-brand px-3 text-white transition-all duration-300 hover:gap-2 hover:pr-4"
      >
        <span className="flex size-8 shrink-0 items-center justify-center bg-white/15">
          <Chat className="size-4" strokeWidth={2} />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100">
          Zalo {site.contact.hotlineDisplay}
        </span>
      </a>

      {site.social.facebook ? (
        <a
          href={site.social.facebook}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={
            locale === "vi"
              ? "Theo dõi Fansipan Group trên Facebook"
              : "Follow Fansipan Group on Facebook"
          }
          className="group flex h-11 items-center gap-0 overflow-hidden bg-ink px-3 text-white transition-all duration-300 hover:gap-2 hover:pr-4"
        >
          <span className="flex size-8 shrink-0 items-center justify-center bg-white/15">
            <Facebook className="size-4" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100">
            Facebook
          </span>
        </a>
      ) : null}

      <a
        href={`tel:${site.contact.hotline}`}
        aria-label={locale === "vi" ? "Gọi điện 0913 339 190" : "Call 0913 339 190"}
        className="group flex h-11 items-center gap-0 overflow-hidden bg-accent px-3 text-ink transition-all duration-300 hover:gap-2 hover:pr-4"
      >
        <span className="flex size-8 shrink-0 items-center justify-center bg-white/15">
          <Phone className="size-4" strokeWidth={2} />
        </span>
        <span className="num max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
          {site.contact.hotlineDisplay}
        </span>
      </a>
    </div>
  );
}
