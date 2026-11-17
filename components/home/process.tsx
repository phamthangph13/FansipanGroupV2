"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";
import { cn } from "@/lib/utils";

const copy = {
  vi: {
    title: "Sáu bước, từ khảo sát đến bàn giao.",
    all: "Quy trình triển khai",
  },
  en: {
    title: "Six steps, from survey to handover.",
    all: "Delivery process",
  },
} as const;

const photos = [
  "/images/projects/nha-may-panasonic.jpg",
  "/images/about/systems.jpg",
  "/images/projects/ge-hai-phong-chiller.jpg",
  "/images/about/team.jpg",
  "/images/careers/technicians.jpg",
  "/images/services/maintenance.jpg",
];

const spacers = ["h-16", "h-24", "h-10", "h-28", "h-14", "h-20"];

export function ProcessSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];
  const rail = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const onScroll = () => {
      const max = node.scrollWidth - node.clientWidth;
      setProgress(max > 0 ? node.scrollLeft / max : 0);
    };
    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  const step = (direction: 1 | -1) => {
    rail.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="display-2 max-w-[20ch]">{c.title}</h2>
            <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
              {site.processIntro[locale]}
            </p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={locale === "vi" ? "Bước trước" : "Previous"}
              className="inline-flex size-12 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={locale === "vi" ? "Bước tiếp theo" : "Next"}
              className="inline-flex size-12 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 h-1.5 w-full bg-brand-100" aria-hidden>
          <div
            className="h-full bg-ink transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(progress * 100, 6)}%` }}
          />
        </div>

        <div
          ref={rail}
          className="no-scrollbar mt-12 grid gap-10 sm:grid-cols-2 lg:flex lg:snap-x lg:snap-mandatory lg:gap-8 lg:overflow-x-auto lg:pb-4"
        >
          {site.process.map((item, index) => (
            <div
              key={item.title.vi}
              className={cn("lg:w-[280px] lg:shrink-0 lg:snap-start", index % 2 === 1 && "sm:mt-14 lg:mt-0")}
            >
              <p className="display-4 leading-snug text-ink">{item.title[locale]}</p>
              <p className="mt-2.5 text-[1rem] leading-relaxed text-ink-soft">
                {item.body[locale]}
              </p>
              <div className={cn(spacers[index % spacers.length])} aria-hidden />
              <div className="relative aspect-[4/5] overflow-hidden bg-sky">
                <Image
                  src={photos[index % photos.length]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 280px, 78vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          <div className="flex items-end sm:col-span-2 lg:w-[280px] lg:shrink-0 lg:snap-start">
            <Link href={`/${locale}${paths.services}`} className="link-arrow">
              {c.all}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
