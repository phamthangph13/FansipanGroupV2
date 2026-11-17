import Image from "next/image";
import { projectStatusLabels } from "@/lib/labels";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const ratios = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[16/10]",
  "aspect-[4/3]",
];

export function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  const name = locale === "vi" ? project.name : project.nameEn;
  const status = projectStatusLabels[project.status][locale];

  return (
    <article
      className="card-enter group mb-12 break-inside-avoid"
      style={{ animationDelay: `${(index % 9) * 55}ms` }}
    >
      <div className={cn("relative overflow-hidden bg-sky", ratios[index % ratios.length])}>
        {project.image ? (
          <Image
            src={project.image}
            alt={
              locale === "vi"
                ? `Hình ảnh minh họa cho ${project.name}`
                : `Illustrative image for ${project.nameEn}`
            }
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-100">
            <Image src="/brand/mark.png" alt="" width={44} height={44} className="opacity-25" />
          </div>
        )}
      </div>

      <h3 className="mt-4 display-4 text-ink transition-colors group-hover:text-brand">
        {name}
      </h3>
      <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{project.scope[locale]}</p>
      <p className="mt-1.5 text-[0.8125rem] text-ink-soft">
        {[project.location[locale], project.year, status].filter(Boolean).join(" · ")}
      </p>
    </article>
  );
}
