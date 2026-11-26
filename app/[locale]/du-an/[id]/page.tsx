import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { RichText } from "@/components/content/rich-text";
import { ProjectCard } from "@/components/projects/project-card";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { Reveal } from "@/components/ui/reveal";
import {
  getPublicProject,
  getPublicProjects,
  getServices,
  getSite,
} from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { projectStatusLabels } from "@/lib/labels";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    back: "Về trang dự án",
    overview: "Tổng quan công trình",
    details: "Thông tin dự án",
    client: "Chủ đầu tư / Khách hàng",
    location: "Địa điểm",
    year: "Năm thực hiện",
    status: "Trạng thái",
    sector: "Lĩnh vực",
    duration: "Thời gian triển khai",
    disciplines: "Hạng mục dịch vụ",
    gallery: "Hình ảnh công trình",
    documents: "Tài liệu liên quan",
    download: "Tải xuống",
    related: "Dự án khác",
    allProjects: "Xem tất cả dự án",
    ctaTitle: "Công trình của bạn có nhu cầu tương tự?",
    ctaBody:
      "Trao đổi với đội ngũ kỹ sư Fansipan Group để đánh giá hiện trạng và đề xuất giải pháp phù hợp.",
    cta: "Yêu cầu khảo sát / Báo giá",
    defaultBody:
      "Dự án được Fansipan Group triển khai theo quy trình kỹ thuật đồng bộ từ khảo sát hiện trạng, đề xuất phương án, thi công lắp đặt đến chạy thử, nghiệm thu và bàn giao vận hành.\n\nThông tin chi tiết về thông số kỹ thuật và tài liệu nội bộ của chủ đầu tư được bảo mật theo thỏa thuận giữa các bên.",
  },
  en: {
    back: "Back to projects",
    overview: "Project overview",
    details: "Project details",
    client: "Client",
    location: "Location",
    year: "Year",
    status: "Status",
    sector: "Sector",
    duration: "Duration",
    disciplines: "Service disciplines",
    gallery: "Project gallery",
    documents: "Related documents",
    download: "Download",
    related: "Other projects",
    allProjects: "View all projects",
    ctaTitle: "Does your facility have a similar requirement?",
    ctaBody:
      "Speak with the Fansipan Group engineering team to assess site conditions and define a suitable delivery approach.",
    cta: "Request a survey / quote",
    defaultBody:
      "Delivered by Fansipan Group through a disciplined engineering workflow from site survey and technical proposal to installation, commissioning and operational handover.\n\nDetailed client specifications and proprietary records are kept confidential under mutual agreement.",
  },
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const lang: Locale = locale === "en" ? "en" : "vi";
  const project = await getPublicProject(id);
  if (!project) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.projects}/${project.id}`,
    title: lang === "vi" ? project.name : project.nameEn,
    description: project.scope[lang],
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const [project, projects, services, site] = await Promise.all([
    getPublicProject(id),
    getPublicProjects(),
    getServices(),
    getSite(),
  ]);

  if (!project) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const name = locale === "vi" ? project.name : project.nameEn;
  const statusLabel = projectStatusLabels[project.status][locale];
  const bodyText = project.body?.[locale]?.trim() || c.defaultBody;
  const matchedServices = services.filter((s) => project.categories.includes(s.id));

  const related = [
    ...projects.filter(
      (item) =>
        item.id !== project.id &&
        item.categories.some((cat) => project.categories.includes(cat)),
    ),
    ...projects.filter(
      (item) =>
        item.id !== project.id &&
        !item.categories.some((cat) => project.categories.includes(cat)),
    ),
  ].slice(0, 3);

  const metaRows = [
    { label: c.client, value: project.client?.[locale] || "" },
    { label: c.location, value: project.location[locale] },
    { label: c.year, value: project.year ? String(project.year) : "" },
    { label: c.status, value: statusLabel },
    { label: c.sector, value: project.sector?.[locale] || "" },
    { label: c.duration, value: project.duration?.[locale] || "" },
  ].filter((row) => Boolean(row.value));

  return (
    <>
      <PageHero
        locale={locale}
        title={name}
        titleClassName="display-article max-w-6xl"
        intro={project.scope[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.projects, href: `/${locale}${paths.projects}` },
          { label: name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-soft">
          <span>
            {[project.location[locale], project.year, statusLabel].filter(Boolean).join(" · ")}
          </span>
          <Link href={`/${locale}${paths.projects}`} className="link-arrow">
            {c.back}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageHero>

      <article className="bg-white py-14 lg:py-20">
        <div className="wrap">
          {project.image ? (
            <div className="card-enter relative aspect-[21/9] overflow-hidden bg-sky">
              <Image
                src={project.image}
                alt={name}
                fill
                sizes="100vw"
                priority
                className="photo-drift object-cover"
              />
            </div>
          ) : null}

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="card-enter lg:col-span-7">
              <h2 className="display-3 text-ink">{c.overview}</h2>
              <div className="mt-6">
                <RichText content={bodyText} />
              </div>

              {project.gallery && project.gallery.length > 0 ? (
                <div className="mt-14">
                  <h3 className="display-4 text-ink">{c.gallery}</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative aspect-[4/3] overflow-hidden bg-sky"
                      >
                        <Image
                          src={src}
                          alt={`${name} — ${index + 1}`}
                          fill
                          sizes="(min-width: 1024px) 32vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {project.documents && project.documents.length > 0 ? (
                <div className="mt-14">
                  <h3 className="display-4 text-ink">{c.documents}</h3>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {project.documents.map((doc) => (
                      <li
                        key={doc.file}
                        className="flex flex-wrap items-center justify-between gap-4 py-4"
                      >
                        <span className="text-[1rem] text-ink">{doc.title}</span>
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noreferrer noopener"
                          download
                          className="link-arrow text-[0.95rem]"
                        >
                          <Download className="size-4" />
                          {c.download}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="sticky top-32 space-y-8 bg-brand-050 p-6 sm:p-8">
                {project.clientLogo ? (
                  <div className="relative h-12 w-36">
                    <Image
                      src={project.clientLogo}
                      alt={project.client?.[locale] || name}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                ) : null}

                <div>
                  <p className="text-[0.8125rem] text-muted">{c.details}</p>
                  <dl className="mt-4 space-y-4">
                    {metaRows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-[0.8125rem] text-ink-soft">{row.label}</dt>
                        <dd className="mt-0.5 text-[1rem] font-medium text-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {matchedServices.length > 0 ? (
                  <div>
                    <p className="text-[0.8125rem] text-ink-soft">{c.disciplines}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {matchedServices.map((service) => (
                        <Link
                          key={service.id}
                          href={`/${locale}${paths.services}/${service.slug}`}
                          className="border border-line bg-white px-3 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-brand hover:text-brand"
                        >
                          {service.shortTitle[locale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary w-full">
                  {c.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="bg-sky-2 py-20 lg:py-28">
          <div className="wrap">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                <h2 className="display-2 text-ink">{c.related}</h2>
                <Link href={`/${locale}${paths.projects}`} className="link-arrow">
                  {c.allProjects}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 [&_article]:mb-0">
              {related.map((item, index) => (
                <ProjectCard key={item.id} project={item} locale={locale} index={index} />
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
    </>
  );
}
