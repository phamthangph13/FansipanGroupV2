"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { EditableText } from "@/components/editor/editable-text";
import { paths, type Locale } from "@/lib/i18n";
import type { Project, Service, ServiceId } from "@/lib/types";
import { cn } from "@/lib/utils";

const copy = {
  vi: {
    title: "Từ hàng không đến nhiệt điện.",
    all: "Tất cả",
    allProjects: "Xem tất cả dự án",
    note:
      "Thông tin dự án được công bố ở mức cơ bản; hình ảnh minh họa cho hạng mục công việc.",
  },
  en: {
    title: "From aviation to thermal power.",
    all: "All",
    allProjects: "View all projects",
    note:
      "Project information is published at a basic level; images illustrate the type of work.",
  },
} as const;

/* deliberately uneven placement — images never share a baseline */
const layout = [
  { span: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "" },
  { span: "lg:col-span-4 lg:col-start-8", aspect: "aspect-[3/2]", offset: "lg:mt-20" },
  { span: "lg:col-span-3 lg:col-start-2", aspect: "aspect-square", offset: "lg:-mt-2" },
  { span: "lg:col-span-4 lg:col-start-6", aspect: "aspect-[16/10]", offset: "lg:-mt-10" },
  { span: "lg:col-span-3 lg:col-start-10", aspect: "aspect-[4/5]", offset: "lg:mt-6" },
  { span: "lg:col-span-4 lg:col-start-2", aspect: "aspect-[3/2]", offset: "lg:mt-4" },
];

export function ProjectsSection({
  locale,
  projects,
  services,
}: {
  locale: Locale;
  projects: Project[];
  services: Service[];
}) {
  const c = copy[locale];
  const [active, setActive] = useState<"all" | ServiceId>("all");

  const filtered = useMemo(
    () =>
      (active === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(active))
      ).slice(0, 6),
    [active, projects],
  );

  return (
    <section id="du-an" className="bg-white py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <EditableText
            k="home.projects.title"
            defaultText={c.title}
            as="h2"
            className="display-2 max-w-[18ch]"
            multiline
          />
          <Link href={`/${locale}${paths.projects}`} className="link-arrow">
            <EditableText k="home.projects.all" defaultText={c.allProjects} as="span" />
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-1">
          <button
            type="button"
            aria-pressed={active === "all"}
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
              aria-pressed={active === service.id}
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

        <div key={active} className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-12">
          {filtered.map((project, index) => {
            const pos = layout[index % layout.length];
            const name = locale === "vi" ? project.name : project.nameEn;
            return (
              <article
                key={project.id}
                className={cn(pos.span, pos.offset, "filter-enter")}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Link href={`/${locale}${paths.projects}/${project.id}`} className="group block">
                  <div className={cn("relative overflow-hidden bg-sky", pos.aspect)}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={
                          locale === "vi"
                            ? `Hình ảnh minh họa cho ${project.name}`
                            : `Illustrative image for ${project.nameEn}`
                        }
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-100">
                        <Image src="/brand/mark.png" alt="" width={48} height={48} className="opacity-25" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 display-4 text-ink transition-colors group-hover:text-brand">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                    {[project.scope[locale], project.location[locale], project.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>

        <EditableText
          k="home.projects.note"
          defaultText={c.note}
          as="p"
          className="mt-16 max-w-xl text-[0.8125rem] leading-relaxed text-muted"
          multiline
        />
      </div>
    </section>
  );
}
