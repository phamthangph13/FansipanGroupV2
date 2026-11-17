"use client";

import { useState } from "react";
import { ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function OfficeMaps({
  locale,
  site,
  mode = "tabs",
}: {
  locale: Locale;
  site: SiteData;
  mode?: "tabs" | "grid";
}) {
  const [active, setActive] = useState(0);
  const offices = site.offices;
  const openLabel = locale === "vi" ? "Mở Google Maps" : "Open in Google Maps";

  if (mode === "grid") {
    return (
      <div className="grid gap-10 md:grid-cols-2">
        {offices.map((office) => (
          <div key={office.id}>
            <p className="text-[0.8125rem] text-ink-soft">{office.kind[locale]}</p>
            <p className="mt-1 text-[1rem] font-semibold text-ink">{office.name[locale]}</p>
            <p className="mt-1.5 max-w-[42ch] text-[1rem] leading-relaxed text-ink-soft">
              {office.address[locale]}
            </p>
            <iframe
              src={office.mapEmbed}
              title={`${office.name[locale]} — Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-4 aspect-[4/3] w-full border-0 grayscale-[0.35]"
            />
            <a
              href={office.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link-arrow mt-4"
            >
              {openLabel}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        ))}
      </div>
    );
  }

  const office = offices[active] ?? offices[0];

  return (
    <div>
      <div className="flex gap-8" role="tablist" aria-label={locale === "vi" ? "Địa điểm" : "Locations"}>
        {offices.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "min-h-11 border-b-2 pb-2 text-left text-[1rem] transition-colors",
              active === index
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {item.name[locale]}
          </button>
        ))}
      </div>
      <iframe
        key={office.id}
        src={office.mapEmbed}
        title={`${office.name[locale]} — Google Maps`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mt-5 aspect-[16/9] w-full border-0 grayscale-[0.3]"
      />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="max-w-[46ch] text-[1rem] leading-relaxed text-ink-soft">
          {office.address[locale]}
        </p>
        <a
          href={office.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="link-arrow shrink-0"
        >
          {openLabel}
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
