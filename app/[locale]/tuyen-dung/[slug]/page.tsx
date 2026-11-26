import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { RichText } from "@/components/content/rich-text";
import { ApplicationForm } from "@/components/forms/application-form";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getJob, getJobs, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata, jobJsonLd, jsonLdScript } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const copy = {
  vi: {
    about: "Mô tả công việc",
    apply: "Gửi ứng tuyển",
    closedTitle: "Vị trí này đã đóng.",
    closedBody:
      "Bạn vẫn có thể gửi CV cho các đợt tuyển dụng tiếp theo qua email tuyển dụng của Fansipan Group.",
    closedCta: "Gửi CV qua email",
    otherJobs: "Vị trí khác",
    allJobs: "Xem tất cả vị trí",
    jobInfo: "Thông tin vị trí",
    salary: "Thu nhập",
    type: "Hình thức",
    location: "Địa điểm",
    department: "Bộ phận",
    deadline: "Hạn nộp",
    status: "Trạng thái",
    open: "Đang nhận hồ sơ",
    closed: "Đã đóng",
    note: "Thông tin tuyển dụng có thể thay đổi theo kế hoạch nhân sự của công ty.",
  },
  en: {
    about: "Job description",
    apply: "Apply now",
    closedTitle: "This position is closed.",
    closedBody:
      "You can still send your CV for future recruitment rounds via the Fansipan Group recruitment email.",
    closedCta: "Email your CV",
    otherJobs: "Other positions",
    allJobs: "View all positions",
    jobInfo: "Position details",
    salary: "Salary",
    type: "Employment type",
    location: "Location",
    department: "Department",
    deadline: "Deadline",
    status: "Status",
    open: "Accepting applications",
    closed: "Closed",
    note: "Recruitment information may change in line with the company's hiring plan.",
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
  const job = await getJob(slug);
  if (!job) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.careers}/${job.slug}`,
    title: job.title[lang],
    description: job.summary[lang],
  });
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [job, jobs, site] = await Promise.all([getJob(slug), getJobs(), getSite()]);
  if (!job) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const others = jobs.filter((item) => item.slug !== job.slug && item.open).slice(0, 3);
  const mailHref = `mailto:${site.contact.careersEmail}?subject=${encodeURIComponent(
    `${locale === "vi" ? "Ứng tuyển" : "Application"}: ${job.title[locale]}`,
  )}`;

  const facts = [
    { label: c.department, value: job.department[locale] },
    { label: c.location, value: job.location[locale] },
    { label: c.type, value: job.type[locale] },
    { label: c.salary, value: job.salary[locale] },
    ...(job.deadline
      ? [{ label: c.deadline, value: formatDate(job.deadline, locale) }]
      : []),
  ];

  return (
    <>
      <PageHero
        locale={locale}
        title={job.title[locale]}
        intro={job.summary[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.careers, href: `/${locale}${paths.careers}` },
          { label: job.title[locale] },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-soft">
          <span>{facts.map((fact) => fact.value).join(" · ")}</span>
          <Link href={`/${locale}${paths.careers}`} className="link-arrow">
            {t.actions.backToCareers}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageHero>

      <section className="bg-white">
        <div className="wrap grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              src: "/images/careers/technicians.jpg",
              alt: locale === "vi" ? "Kỹ thuật viên tại công trình" : "Technicians on site",
            },
            {
              src: "/images/about/plant.jpg",
              alt: locale === "vi" ? "Nhà máy đang vận hành" : "Plant in operation",
            },
            {
              src: "/images/about/systems.jpg",
              alt: locale === "vi" ? "Hệ thống cơ điện" : "M&E systems",
            },
            {
              src: "/images/careers/panel.jpg",
              alt: locale === "vi" ? "Vận hành thiết bị kỹ thuật" : "Operating technical equipment",
            },
          ].map((photo) => (
            <div key={photo.src} className="card-enter relative aspect-[3/2] overflow-hidden bg-sky">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="photo-drift object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="display-2 text-ink">{c.about}</h2>
            <div className="card-enter mt-8 max-w-[68ch]">
              <RichText content={job.body[locale]} />
            </div>

            {others.length ? (
              <div className="mt-16">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                  <h2 className="display-3 text-ink">{c.otherJobs}</h2>
                  <Link href={`/${locale}${paths.careers}`} className="link-arrow">
                    {c.allJobs}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <ul className="mt-6 space-y-4">
                  {others.map((item) => (
                    <li key={item.slug} className="card-enter">
                      <Link
                        href={`/${locale}${paths.careers}/${item.slug}`}
                        className="group flex items-start justify-between gap-6 py-1"
                      >
                        <span>
                          <span className="block text-[1rem] font-semibold text-ink underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">
                            {item.title[locale]}
                          </span>
                          <span className="mt-1 block text-[0.8125rem] text-ink-soft">
                            {item.department[locale]} · {item.location[locale]}
                          </span>
                        </span>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft transition-colors group-hover:text-ink" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-12 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft">
              {c.note}{" "}
              <a href={mailHref} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                {site.contact.careersEmail}
              </a>
            </p>
          </div>

          <aside id="apply" className="scroll-mt-28 lg:col-span-5 xl:col-span-4">
            <div className="card-enter space-y-8 lg:sticky lg:top-32">
              <div className="card-enter">
                <p className="text-[0.8125rem] text-ink-soft">{c.jobInfo}</p>
                <dl className="mt-4 space-y-3">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-[0.8125rem] text-ink-soft">{fact.label}</dt>
                      <dd className="mt-0.5 text-[1rem] text-ink">{fact.value}</dd>
                    </div>
                  ))}
                  <div>
                    <dt className="text-[0.8125rem] text-ink-soft">{c.status}</dt>
                    <dd
                      className={
                        job.open
                          ? "mt-0.5 text-[1rem] font-semibold text-green"
                          : "mt-0.5 text-[1rem] font-semibold text-muted"
                      }
                    >
                      {job.open ? c.open : c.closed}
                    </dd>
                  </div>
                </dl>
              </div>

              {job.open ? (
                <ApplicationForm
                  locale={locale}
                  jobSlug={job.slug}
                  jobTitle={job.title[locale]}
                />
              ) : (
                <div>
                  <p className="display-4 text-ink">{c.closedTitle}</p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{c.closedBody}</p>
                  <a href={mailHref} className="btn btn-outline mt-5">
                    {c.closedCta}
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      {job.open ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jobJsonLd(job, locale)) }}
        />
      ) : null}
    </>
  );
}
