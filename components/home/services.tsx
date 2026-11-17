"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { paths, type Locale } from "@/lib/i18n";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const copy = {
  vi: {
    heading: "Bốn lĩnh vực, một đầu mối.",
    all: "Xem tất cả dịch vụ",
    detail: "Xem dịch vụ",
  },
  en: {
    heading: "Four disciplines, one partner.",
    all: "View all services",
    detail: "View service",
  },
} as const;

const fallbackImages: Record<string, string> = {
  hvac: "/images/services/hvac.jpg",
  me: "/images/services/me.jpg",
  cooling: "/images/services/cooling.jpg",
  maintenance: "/images/services/maintenance.jpg",
};

export function ServicesSection({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const c = copy[locale];
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const rect = node.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 0.9999);
      const index = Math.floor(progress * services.length);
      setActive(Math.min(index, services.length - 1));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [services.length]);

  const imageOf = (service: Service) => service.image || fallbackImages[service.id];
  const current = services[active];
  const following = services[(active + 1) % services.length];

  return (
    <section className="bg-navy text-white">
      {/* compact list — phone */}
      <div className="wrap py-24 lg:hidden">
        <h2 className="display-2 max-w-[16ch] text-white">{c.heading}</h2>
        <div className="mt-10 space-y-16">
          {services.map((service) => (
            <div key={service.id}>
              <div className="relative aspect-[16/10] overflow-hidden bg-navy-2">
                <Image
                  src={imageOf(service)}
                  alt={service.title[locale]}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="display-3 mt-5 text-white">{service.shortTitle[locale]}</h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-white/65">
                {service.tagline[locale]}
              </p>
              <Link
                href={`/${locale}${paths.services}/${service.slug}`}
                className="link-arrow-light mt-4"
              >
                {c.detail}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
        <Link href={`/${locale}${paths.services}`} className="link-arrow-light mt-14">
          {c.all}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* sticky scene — desktop */}
      <div ref={wrapRef} className="relative hidden lg:block lg:h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="wrap relative grid w-full grid-cols-12 items-center gap-8">
            <div className="col-span-7">
              <h2 className="display-2 max-w-[15ch] text-white">{c.heading}</h2>
              <ul className="mt-10 space-y-1">
                {services.map((service, index) => (
                  <li key={service.id}>
                    <Link
                      href={`/${locale}${paths.services}/${service.slug}`}
                      className={cn(
                        "group flex items-baseline gap-4 py-1 transition-colors",
                        index === active ? "text-white" : "text-white/65 hover:text-white/90",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-px w-8 shrink-0 self-center transition-colors",
                          index === active ? "bg-accent" : "bg-white/25",
                        )}
                      />
                      <span className="display-3 leading-tight">
                        {service.shortTitle[locale]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8 min-h-[3.5rem] max-w-[46ch] text-[1rem] leading-relaxed text-white/70">
                {current?.tagline[locale]}
              </p>
              <Link href={`/${locale}${paths.services}`} className="link-arrow-light mt-2">
                {c.all}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="relative col-span-5 h-[52vh]">
              {current ? (
                <div className="absolute right-10 top-0 w-[62%] overflow-hidden bg-navy-2">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={imageOf(current)}
                      alt={current.title[locale]}
                      fill
                      sizes="30vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
              {following ? (
                <div className="absolute bottom-0 left-0 w-[46%] overflow-hidden bg-navy-2">
                  <div className="relative aspect-square">
                    <Image
                      src={imageOf(following)}
                      alt={following.title[locale]}
                      fill
                      sizes="22vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
