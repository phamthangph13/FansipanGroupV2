import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { Reveal } from "@/components/ui/reveal";
import { getProjects, getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Dự án",
    title: "Dự án & công trình",
    intro:
      "Danh mục dự án của Fansipan Group được nhóm theo bốn lĩnh vực dịch vụ, từ hàng không, điện tử, cơ khí đến thép, giấy, khách sạn và nhiệt điện.",
    projects: "Dự án",
    groups: "Nhóm dịch vụ",
    sectors: "Lĩnh vực công nghiệp",
    featured: "Dự án tiêu biểu",
    ctaTitle: "Công trình của bạn có điểm tương đồng?",
    ctaBody:
      "Trao đổi với đội ngũ kỹ thuật để đánh giá phạm vi công việc và phương án triển khai phù hợp.",
    cta: "Yêu cầu khảo sát",
  },
  en: {
    eyebrow: "Projects",
    title: "Projects & facilities",
    intro:
      "Fansipan Group's portfolio is grouped by our four service areas, spanning aviation, electronics, machinery, steel, paper, hospitality and power generation.",
    projects: "Projects",
    groups: "Service groups",
    sectors: "Industrial sectors",
    featured: "Featured project",
    ctaTitle: "Does your facility face a similar challenge?",
    ctaBody:
      "Talk to our engineering team to assess the scope and define a suitable delivery approach.",
    cta: "Request a survey",
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
    path: paths.projects,
    title: lang === "vi" ? "Dự án" : "Projects",
    description:
      lang === "vi"
        ? "Dự án tiêu biểu của Fansipan Group trong lĩnh vực cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống cho nhà máy, khu công nghiệp."
        : "Selected Fansipan Group projects across M&E, HVAC, cooling towers and system maintenance for factories and industrial parks.",
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  const [projects, services, site] = await Promise.all([
    getProjects(),
    getServices(),
    getSite(),
  ]);
  const c = copy[locale];

  const featured = projects.find((project) => project.image) ?? projects[0];
  const facts = [
    { value: String(projects.length), label: c.projects },
    { value: String(services.length), label: c.groups },
    { value: String(site.sectors.length), label: c.sectors },
  ];

  return (
    <>
      <section className="bg-white">
        <div className="wrap pt-32 pb-12 lg:pt-40 lg:pb-16">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
                  <li>
                    <Link href={`/${locale}`} className="transition-colors hover:text-ink">
                      {ui[locale].nav.home}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-ink" aria-current="page">
                    {c.eyebrow}
                  </li>
                </ol>
              </nav>

              <Reveal>
                <h1 className="display-1 mt-10 max-w-5xl">{c.title}</h1>
                <p className="lead mt-7 max-w-2xl">{c.intro}</p>
              </Reveal>

              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <p className="display-3 text-ink">{fact.value}</p>
                    <p className="mt-1 text-[1rem] text-muted">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {featured ? (
              <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden bg-sky">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={locale === "vi" ? featured.name : featured.nameEn}
                        fill
                        sizes="(min-width: 1024px) 34vw, 100vw"
                        priority
                        className="photo-drift object-cover"
                      />
                    ) : null}
                  </div>
                  <figcaption className="mt-3 text-[0.8125rem] text-muted">
                    {c.featured} · {locale === "vi" ? featured.name : featured.nameEn} ·{" "}
                    {featured.location[locale]}
                  </figcaption>
                </figure>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="wrap">
          <ProjectsExplorer
            locale={locale}
            projects={projects}
            services={services}
            initialCategory={category ?? "all"}
          />
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
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
    </>
  );
}
