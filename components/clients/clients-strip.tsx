import { cn } from "@/lib/utils";
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

export function ClientsStrip({
  locale,
  site,
  compact = false,
}: {
  locale: Locale;
  site: SiteData;
  compact?: boolean;
}) {
  const c = copy[locale];
  const names = site.clients.logos.map((logo) => logo.name);

  if (compact) {
    return (
      <section className="bg-white py-12">
        <div className="wrap flex flex-wrap items-baseline gap-x-9 gap-y-3">
          <p className="text-[0.8125rem] text-muted">{c.heading}</p>
          {names.map((name) => (
            <p key={name} className="text-[1rem] text-ink/75">
              {name}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="khach-hang" className="bg-white py-20 lg:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <p className="text-[0.8125rem] leading-relaxed text-muted">{c.heading}</p>
          <p className="mt-3 max-w-[24ch] text-[0.8125rem] leading-relaxed text-muted/80">
            {site.clients.note[locale]}
          </p>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            {names.map((name, index) => (
              <li
                key={name}
                className={cn(
                  "display-4 text-ink",
                  index % 2 === 1 && "sm:pl-6",
                )}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
