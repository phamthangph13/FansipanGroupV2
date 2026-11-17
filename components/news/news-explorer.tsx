"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/news/article-card";
import { articleCategories, categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ui, type Locale } from "@/lib/i18n";
import type { Article, ArticleCategory } from "@/lib/types";

export function NewsExplorer({
  locale,
  articles,
}: {
  locale: Locale;
  articles: Article[];
}) {
  const [active, setActive] = useState<"all" | ArticleCategory>("all");
  const filtered = useMemo(
    () =>
      active === "all" ? articles : articles.filter((article) => article.category === active),
    [active, articles],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            onClick={() => setActive("all")}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
                active === "all"
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {ui[locale].labels.all}
          </button>
          {articleCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
              className={cn(
                "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
                active === category
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink",
              )}
            >
              {categoryLabel(category, locale)}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-[0.8125rem] text-ink-soft">
          {filtered.length} {locale === "vi" ? "bài viết" : "articles"}
        </p>
      </div>

      {filtered.length ? (
        <div
          key={active}
          className="filter-enter mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-[1rem] text-muted">{ui[locale].labels.noResults}</p>
      )}
    </div>
  );
}
