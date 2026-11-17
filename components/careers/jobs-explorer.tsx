"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { paths, ui, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/lib/types";

const copy = {
  vi: {
    search: "Tìm theo vị trí hoặc bộ phận…",
    all: "Tất cả",
    open: "Đang tuyển",
    closed: "Đã đóng",
    departments: "Bộ phận",
    results: "vị trí",
    noResults: "Không tìm thấy vị trí phù hợp.",
    deadline: "Hạn nộp",
    statusOpen: "Đang nhận hồ sơ",
    statusClosed: "Đã đóng",
    view: "Xem vị trí",
  },
  en: {
    search: "Search by position or department…",
    all: "All",
    open: "Open",
    closed: "Closed",
    departments: "Department",
    results: "positions",
    noResults: "No matching positions.",
    deadline: "Deadline",
    statusOpen: "Accepting applications",
    statusClosed: "Closed",
    view: "View position",
  },
} as const;

export function JobsExplorer({ locale, jobs }: { locale: Locale; jobs: Job[] }) {
  const c = copy[locale];
  const t = ui[locale];
  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.department[locale]))),
    [jobs, locale],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (status === "open" && !job.open) return false;
      if (status === "closed" && job.open) return false;
      if (department !== "all" && job.department[locale] !== department) return false;
      if (!needle) return true;
      return (
        job.title[locale].toLowerCase().includes(needle) ||
        job.department[locale].toLowerCase().includes(needle) ||
        job.location[locale].toLowerCase().includes(needle)
      );
    });
  }, [jobs, status, department, query, locale]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted/60"
            strokeWidth={1.6}
          />
          <label htmlFor="job-search" className="sr-only">
            {t.labels.search}
          </label>
          <input
            id="job-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.search}
            className="input pl-11"
          />
        </div>
        <div className="flex items-center gap-6" role="group" aria-label={t.labels.status}>
          {(
            [
              { id: "all", label: c.all },
              { id: "open", label: c.open },
              { id: "closed", label: c.closed },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatus(item.id)}
              aria-pressed={status === item.id}
              className={cn(
                "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
                status === item.id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-1">
        <span className="text-[0.8125rem] text-ink-soft">{c.departments}</span>
        <button
          type="button"
          onClick={() => setDepartment("all")}
          className={cn(
            "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
            department === "all"
              ? "border-accent text-ink"
              : "border-transparent text-ink-soft hover:text-ink",
          )}
        >
          {c.all}
        </button>
        {departments.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setDepartment(item)}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
              department === item
                ? "border-accent text-ink"
                : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-8 text-[0.8125rem] text-ink-soft">
        {filtered.length} {c.results}
      </p>

      {filtered.length ? (
        <ul key={`${status}-${department}-${query}`} className="filter-enter mt-6">
          {filtered.map((job) => (
            <li key={job.slug} className="mt-12 first:mt-0">
              <Link
                href={`/${locale}${paths.careers}/${job.slug}`}
                className="card-enter group grid gap-4 lg:grid-cols-12 lg:items-start lg:gap-8"
              >
                <div className="lg:col-span-8">
                  <h3 className="display-4 text-ink transition-colors group-hover:text-brand">
                    {job.title[locale]}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft">
                    {job.summary[locale]}
                  </p>
                  <p className="mt-3 text-[0.8125rem] text-ink-soft">
                    {[
                      job.department[locale],
                      job.location[locale],
                      job.type[locale],
                      job.deadline
                        ? `${c.deadline}: ${formatDate(job.deadline, locale)}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 lg:col-span-4 lg:flex-col lg:items-end lg:gap-3">
                  <span
                    className={cn(
                      "text-[0.8125rem]",
                      job.open ? "text-green" : "text-muted",
                    )}
                  >
                    {job.open ? c.statusOpen : c.statusClosed}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[1rem] text-ink">
                    {c.view}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-[1rem] text-muted">{c.noResults}</p>
      )}
    </div>
  );
}
