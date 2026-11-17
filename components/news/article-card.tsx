import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { ArticleArt } from "@/components/illustrations/article-art";
import { categoryLabel } from "@/lib/labels";
import { paths, ui, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

export function ArticleCard({
  article,
  locale,
  featured = false,
}: {
  article: Article;
  locale: Locale;
  featured?: boolean;
}) {
  const t = ui[locale];

  return (
    <Link
      href={`/${locale}${paths.news}/${article.slug}`}
      className="card-enter group flex h-full flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sky">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title[locale]}
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <ArticleArt
            category={article.category}
            className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3
          className={
            featured
              ? "display-3 line-clamp-3 text-ink transition-colors group-hover:text-brand"
              : "display-4 line-clamp-3 text-ink transition-colors group-hover:text-brand"
          }
        >
          {article.title[locale]}
        </h3>
        <p className="mt-2 text-[0.8125rem] text-ink-soft">
          {categoryLabel(article.category, locale)} · {formatDate(article.date, locale)}
        </p>
        <p className="mt-3 line-clamp-2 text-[1rem] leading-relaxed text-ink-soft">
          {article.excerpt[locale]}
        </p>
        <span className="link-arrow mt-4 inline-flex">
          {t.actions.readMore}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
