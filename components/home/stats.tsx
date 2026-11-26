import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    title: "Năng lực, đo bằng kết quả.",
    note: "Số liệu được Fansipan Group cập nhật theo tình hình hoạt động thực tế.",
  },
  en: {
    title: "Capability, measured in results.",
    note: "Figures are maintained by Fansipan Group based on current operations.",
  },
} as const;

export function StatsBand({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section className="bg-white pb-24 pt-4 lg:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Reveal>
            <Editable
              k="home.stats.title"
              locale={locale}
              fallback={c.title}
              as="h2"
              className="display-3 text-ink"
              multiline
            />
          </Reveal>
          <Reveal delay={100}>
            <Editable
              k="home.stats.note"
              locale={locale}
              fallback={c.note}
              as="p"
              className="mt-4 max-w-[30ch] text-[0.8125rem] leading-relaxed text-muted"
              multiline
            />
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <dl className="grid gap-10 sm:grid-cols-3">
            {site.stats.map((stat, index) => (
              <Reveal key={stat.label[locale]} delay={index * 100}>
                <dt className="sr-only">
                  <Editable
                    k={`home.stats.${index}.label`}
                    locale={locale}
                    fallback={stat.label[locale]}
                    as="span"
                  />
                </dt>
                <dd className="num display-2 leading-[0.9] text-ink">
                  <CountUp value={stat.value} />
                </dd>
                <dd className="mt-3 max-w-[18ch] text-[1rem] leading-snug text-ink-soft">
                  <Editable
                    k={`home.stats.${index}.label`}
                    locale={locale}
                    fallback={stat.label[locale]}
                    as="span"
                    multiline
                  />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
