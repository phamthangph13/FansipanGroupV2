import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { ArticleArt } from "@/components/illustrations/article-art";
import { NewsExplorer } from "@/components/news/news-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getArticles, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { categoryLabel } from "@/lib/labels";
import { buildMetadata } from "@/lib/seo";
import { formatDate, readingTimeLabel } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Tin tức & kiến thức",
    title: "Góc nhìn kỹ thuật.",
    intro:
      "Kinh nghiệm triển khai, kiến thức vận hành và những ghi nhận từ các dự án công nghiệp của Fansipan Group.",
    featured: "Bài viết nổi bật",
    allTitle: "Bài viết theo chủ đề.",
    articles: "bài viết",
    read: "Đọc bài viết",
    ctaTitle: "Cần trao đổi về một hệ thống cụ thể?",
    ctaBody:
      "Đội ngũ kỹ thuật sẵn sàng trao đổi về hiện trạng, phạm vi công việc và phương án phù hợp với công trình của bạn.",
    cta: "Liên hệ đội ngũ kỹ thuật",
  },
  en: {
    eyebrow: "News & insights",
    title: "Engineering notes.",
    intro:
      "Delivery experience, operational knowledge and notes from Fansipan Group's industrial projects.",
    featured: "Featured article",
    allTitle: "Articles by topic.",
    articles: "articles",
    read: "Read the article",
    ctaTitle: "Need to discuss a specific system?",
    ctaBody:
      "Our engineering team is ready to discuss the current situation, scope of work and a suitable approach for your facility.",
    cta: "Contact our engineering team",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.news,
    title: lang === "vi" ? "Tin tức & kiến thức" : "News & insights",
    description:
      lang === "vi"
        ? "Tin tức, kiến thức kỹ thuật và ghi nhận từ các dự án cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống của Fansipan Group."
        : "News, technical knowledge and project notes on M&E, HVAC, cooling towers and system maintenance from Fansipan Group.",
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [articles, site] = await Promise.all([getArticles(), getSite()]);
  const c = copy[locale];
  const featured = articles[0];

  return (
    <>
      <section className="bg-white">
        <div className="wrap pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
                  <li>
                    <Link href={`/${locale}`} className="transition-colors hover:text-ink">
                      {locale === "vi" ? "Trang chủ" : "Home"}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-ink" aria-current="page">
                    {c.eyebrow}
                  </li>
                </ol>
              </nav>

              <h1 className="display-1 mt-10 max-w-3xl">{c.title}</h1>
              <p className="lead mt-7 max-w-xl">{c.intro}</p>
              <p className="mt-8 text-[0.8125rem] text-ink">
                {articles.length} {c.articles}
              </p>
            </div>

            {featured ? (
              <div className="lg:col-span-6 lg:col-start-7">
                <Link
                  href={`/${locale}${paths.news}/${featured.slug}`}
                  className="card-enter group grid gap-6 sm:grid-cols-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-sky">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.title[locale]}
                        fill
                        sizes="(min-width: 1024px) 22vw, 50vw"
                        priority
                        className="photo-drift object-cover"
                      />
                    ) : (
                      <ArticleArt
                        category={featured.category}
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-end">
                    <h2 className="display-4 line-clamp-2 text-ink transition-colors group-hover:text-brand">
                      {featured.title[locale]}
                    </h2>
                    <p className="mt-3 text-[0.8125rem] text-ink-soft">
                      {c.featured} · {categoryLabel(featured.category, locale)} ·{" "}
                      {formatDate(featured.date, locale)}
                    </p>
                    <span className="link-arrow mt-5">
                      {c.read}
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap card-enter">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="display-2 text-ink">{c.allTitle}</h2>
            <Link href={`/${locale}${paths.contact}`} className="link-arrow">
              {locale === "vi" ? "Gửi câu hỏi" : "Ask a question"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10">
            <NewsExplorer locale={locale} articles={articles} />
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="display-3 max-w-[22ch] text-white">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white/65">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
