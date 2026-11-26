import Image from "next/image";
import { cn } from "@/lib/utils";
import { Editable } from "@/components/editor/editable";
import { getPartners } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    heading: "Khách hàng và đối tác",
  },
  en: {
    heading: "Clients & partners",
  },
} as const;

export async function ClientsStrip({
  locale,
  site,
  compact = false,
}: {
  locale: Locale;
  site: SiteData;
  compact?: boolean;
}) {
  const c = copy[locale];
  const partners = await getPartners();
  const items = partners.length
    ? partners.map((partner) => ({
        name: partner.name,
        logo: partner.logo,
        url: partner.url,
      }))
    : site.clients.logos.map((logo) => ({
        name: logo.name,
        logo: logo.src,
        url: "",
      }));

  if (compact) {
    return (
      <section className="bg-white py-12">
        <div className="wrap flex flex-wrap items-baseline gap-x-9 gap-y-3">
          <p className="text-[0.8125rem] text-muted">
            <Editable
              k="clients.heading"
              locale={locale}
              fallback={c.heading}
              as="span"
            />
          </p>
          {items.map((item) =>
            item.url ? (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[1rem] text-ink/75 transition-colors hover:text-ink"
              >
                {item.name}
              </a>
            ) : (
              <p key={item.name} className="text-[1rem] text-ink/75">
                {item.name}
              </p>
            ),
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="khach-hang" className="bg-white py-20 lg:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <p className="text-[0.8125rem] leading-relaxed text-muted">
            <Editable
              k="clients.heading"
              locale={locale}
              fallback={c.heading}
              as="span"
            />
          </p>
          <p className="mt-3 max-w-[24ch] text-[0.8125rem] leading-relaxed text-muted/80">
            <Editable
              k="clients.note"
              locale={locale}
              fallback={site.clients.note[locale]}
              as="span"
              multiline
            />
          </p>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            {items.map((item, index) => (
              <li
                key={item.name}
                className={cn(
                  "display-4 text-ink",
                  index % 2 === 1 && "sm:pl-6",
                )}
              >
                {site.clients.showLogos && item.logo ? (
                  <div className="relative h-10 w-32">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                ) : item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-brand"
                  >
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
