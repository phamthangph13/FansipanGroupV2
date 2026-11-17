"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/projects/project-card";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { Project, Service, ServiceId } from "@/lib/types";

const copy = {
  vi: {
    all: "Tất cả",
    results: "dự án",
    more: "Xem thêm",
    note:
      "Thông tin dự án được công bố ở mức cơ bản. Hình ảnh kèm theo là ảnh minh họa cho hạng mục công việc, không phải ảnh công trình thực tế.",
  },
  en: {
    all: "All",
    results: "projects",
    more: "View more",
    note:
      "Project information is published at a basic level. Images illustrate the type of work and are not photographs of the actual facilities.",
  },
} as const;

export function ProjectsExplorer({
  locale,
  projects,
  services,
  initialCategory = "all",
  limit,
  showNote = true,
}: {
  locale: Locale;
  projects: Project[];
  services: Service[];
  initialCategory?: string;
  limit?: number;
  showNote?: boolean;
}) {
  const validInitial = ["all", ...services.map((service) => service.id)].includes(initialCategory)
    ? initialCategory
    : "all";
  const [active, setActive] = useState(validInitial);
  const c = copy[locale];

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(active as ServiceId)),
    [active, projects],
  );
  const visible = limit ? filtered.slice(0, limit) : filtered;
  const moreHref = `/${locale}${paths.projects}${
    active === "all" ? "" : `?category=${active}`
  }`;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            onClick={() => setActive("all")}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
              active === "all"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {c.all}
          </button>
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={active === service.id}
              onClick={() => setActive(service.id)}
              className={cn(
                "inline-flex min-h-11 items-center border-b-2 pb-1 text-[1rem] transition-colors",
                active === service.id
                  ? "border-accent text-ink"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {service.shortTitle[locale]}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-[0.8125rem] text-muted">
          {filtered.length} {c.results}
        </p>
      </div>

      {filtered.length ? (
        <div key={active} className="filter-enter mt-12 columns-1 gap-8 md:columns-2 xl:columns-3">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} locale={locale} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-[1rem] text-muted">{ui[locale].labels.noResults}</p>
      )}

      {limit ? (
        <div className="mt-4">
          <Link href={moreHref} className="link-arrow">
            {c.more}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}

      {showNote ? (
        <p className="mt-10 max-w-3xl text-[0.8125rem] leading-relaxed text-muted">{c.note}</p>
      ) : null}
    </div>
  );
}
