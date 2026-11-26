import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import { categoryLabel } from "@/lib/labels";
import { paths, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/types";

const copy = {
  vi: {
    title: "Góc nhìn từ công trường.",
    all: "Xem tất cả tin tức",
  },
  en: {
    title: "Notes from site and engineering.",
    all: "View all news",
  },
} as const;

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function NewsSection({ locale, articles }: { locale: Locale; articles: Article[] }) {
  const c = copy[locale];
  const [lead, ...rest] = articles.slice(0, 3);
  if (!lead) return null;

  return (
    <section id="tin-tuc" className="bg-white py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Editable
            k="home.news.title"
            locale={locale}
            fallback={c.title}
            as="h2"
            className="display-2 max-w-[19ch]"
            multiline
          />
          <Link href={`/${locale}${paths.news}`} className="link-arrow">
            <Editable k="home.news.all" locale={locale} fallback={c.all} as="span" />
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Link
              href={`/${locale}${paths.news}/${lead.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-sky">
                {lead.image ? (
                  <Image
                    src={lead.image}
                    alt={lead.title[locale]}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-100">
                    <Image src="/brand/mark.png" alt="" width={56} height={56} className="opacity-25" />
                  </div>
                )}
              </div>
              <h3 className="display-3 mt-2 max-w-[24ch] text-ink transition-colors group-hover:text-brand">
                {lead.title[locale]}
              </h3>
              <p className="mt-3 text-[0.8125rem] text-muted">
                {categoryLabel(lead.category, locale)} · {formatDate(lead.date, locale)}
              </p>
              <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
                {lead.excerpt[locale]}
              </p>
            </Link>
          </Reveal>

          <div className="space-y-12 lg:col-span-5 lg:pt-10">
            {rest.map((article, index) => (
              <Reveal key={article.slug} delay={120 + index * 100}>
                <Link
                  href={`/${locale}${paths.news}/${article.slug}`}
                  className="group block"
                >
                  <h3 className="line-clamp-2 display-4 text-ink transition-colors group-hover:text-brand">
                    {article.title[locale]}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] text-muted">
                    {categoryLabel(article.category, locale)} · {formatDate(article.date, locale)}
                  </p>
                  <p className="mt-2 line-clamp-2 max-w-[44ch] text-[1rem] leading-relaxed text-ink-soft">
                    {article.excerpt[locale]}
                  </p>
                  <span className="link-arrow mt-3 inline-flex text-[1rem]">
                    <Editable
                      k="home.news.readMore"
                      locale={locale}
                      fallback={locale === "vi" ? "Đọc tiếp" : "Read more"}
                      as="span"
                    />
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
