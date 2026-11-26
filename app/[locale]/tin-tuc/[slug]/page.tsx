import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { ArticleArt } from "@/components/illustrations/article-art";
import { ArticleCard } from "@/components/news/article-card";
import { RichText } from "@/components/content/rich-text";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getArticle, getArticles, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { categoryLabel } from "@/lib/labels";
import { articleJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

const copy = {
  vi: {
    back: "Về trang tin tức",
    share: "Chia sẻ",
    related: "Bài viết liên quan",
    ctaTitle: "Cần tư vấn cho công trình của bạn?",
    ctaBody:
      "Gửi hiện trạng hoặc mục tiêu vận hành, đội ngũ kỹ thuật Fansipan Group sẽ phản hồi với hướng trao đổi phù hợp.",
    cta: "Yêu cầu tư vấn",
    author: "Fansipan Group",
    authorRole: "Đội ngũ kỹ thuật",
  },
  en: {
    back: "Back to news",
    share: "Share",
    related: "Related articles",
    ctaTitle: "Need advice for your facility?",
    ctaBody:
      "Send the current situation or operating objective and the Fansipan Group engineering team will respond with a suitable next step.",
    cta: "Request consultation",
    author: "Fansipan Group",
    authorRole: "Engineering team",
  },
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang: Locale = locale === "en" ? "en" : "vi";
  const article = await getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.news}/${article.slug}`,
    title: article.title[lang],
    description: article.excerpt[lang],
    type: "article",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [article, articles, site] = await Promise.all([
    getArticle(slug),
    getArticles(),
    getSite(),
  ]);

  if (!article) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const related = [
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category === article.category,
    ),
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category !== article.category,
    ),
  ].slice(0, 3);
  const url = absoluteUrl(`/${locale}${paths.news}/${article.slug}`);

  return (
    <>
      <PageHero
        locale={locale}
        title={article.title[locale]}
        titleClassName="display-article max-w-7xl"
        intro={article.excerpt[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.news, href: `/${locale}${paths.news}` },
          { label: article.title[locale] },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-soft">
          <span>
            {categoryLabel(article.category, locale)} · {formatDate(article.date, locale)} ·{" "}
            {article.readingMinutes} {locale === "vi" ? "phút đọc" : "min read"}
          </span>
          <Link href={`/${locale}${paths.news}`} className="link-arrow">
            {c.back}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageHero>

      <article className="bg-white py-14 lg:py-20">
        <div className="wrap">
          <div className="card-enter relative aspect-[21/9] overflow-hidden bg-sky">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title[locale]}
                fill
                sizes="100vw"
                className="photo-drift object-cover"
              />
            ) : (
              <ArticleArt category={article.category} className="absolute inset-0 h-full w-full" />
            )}
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="card-enter lg:col-span-7">
              <RichText content={article.body[locale]} />

              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[1rem] font-semibold text-ink">{c.author}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-soft">{c.authorRole}</p>
                </div>
                <div className="flex items-center gap-x-6 text-[0.8125rem]">
                  <span className="text-ink-soft">{c.share}</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="sticky top-32 space-y-10">
                <div className="card-enter">
                  <p className="text-[1rem] font-semibold text-ink">{t.nav.services}</p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                    {locale === "vi"
                      ? "Xem phạm vi công việc và quy trình triển khai cho từng lĩnh vực."
                      : "Review the scope of work and delivery process for each discipline."}
                  </p>
                  <Link href={`/${locale}${paths.services}`} className="link-arrow mt-4">
                    {t.actions.viewService}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="card-enter">
                  <p className="text-[0.8125rem] text-ink-soft">{site.company.displayName}</p>
                  <blockquote className="mt-3 font-display text-[1.375rem] font-medium leading-snug text-ink">
                    “{site.company.slogan[locale]}”
                  </blockquote>
                  <Link href={`/${locale}${paths.contact}#quote`} className="link-arrow mt-5">
                    {t.actions.contactConsult}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="bg-sky-2 py-20 lg:py-28">
          <div className="wrap">
            <div className="card-enter flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="display-2 text-ink">{c.related}</h2>
              <Link href={`/${locale}${paths.news}`} className="link-arrow">
                {t.actions.allNews}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap card-enter flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="display-3 max-w-[20ch] text-white">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white/65">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(article, locale)) }}
      />
    </>
  );
}
