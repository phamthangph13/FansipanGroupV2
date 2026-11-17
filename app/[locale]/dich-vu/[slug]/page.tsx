import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { ProjectCard } from "@/components/projects/project-card";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { Reveal } from "@/components/ui/reveal";
import { getProjects, getService, getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui } from "@/lib/i18n";
import { buildMetadata, jsonLdScript, serviceJsonLd } from "@/lib/seo";

const copy = {
  vi: {
    role: "Vai trò của hệ thống",
    scope: "Phạm vi công việc",
    audiences: "Đối tượng & loại công trình phù hợp",
    projects: "Dự án liên quan",
    process: "Quy trình triển khai",
    consult: "Yêu cầu tư vấn",
    viewProjects: "Xem dự án tiêu biểu",
    allProjects: "Xem tất cả dự án",
    note: "Lưu ý",
    otherServices: "Dịch vụ khác",
    contents: "Nội dung",
    contactTitle: "Trao đổi với kỹ sư",
    contactBody: "Gửi hiện trạng hoặc mục tiêu vận hành để được tư vấn phạm vi phù hợp.",
  },
  en: {
    role: "The role of the system",
    scope: "Scope of work",
    audiences: "Suitable facilities & applications",
    projects: "Related projects",
    process: "Delivery process",
    consult: "Request consultation",
    viewProjects: "View featured projects",
    allProjects: "View all projects",
    note: "Note",
    otherServices: "Other services",
    contents: "Contents",
    contactTitle: "Talk to an engineer",
    contactBody: "Send the current situation or operating objective and we will advise on the right scope.",
  },
} as const;

export async function generateStaticParams() {
  const services = await getServices();
  return services.flatMap((service) => [
    { locale: "vi", slug: service.slug },
    { locale: "en", slug: service.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale === "en" ? "en" : "vi";
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.services}/${service.slug}`,
    title: service.title[lang],
    description: service.short[lang],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [service, services, projects, site] = await Promise.all([
    getService(slug),
    getServices(),
    getProjects(),
    getSite(),
  ]);

  if (!service) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const related = projects.filter((project) => project.categories.includes(service.id));
  const others = services.filter((item) => item.id !== service.id);

  const sections = [
    { id: "pham-vi", label: c.scope },
    { id: "vai-tro", label: c.role },
    { id: "doi-tuong", label: c.audiences },
    ...(related.length ? [{ id: "du-an", label: c.projects }] : []),
    { id: "quy-trinh", label: c.process },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        title={service.title[locale]}
        titleClassName="display-service"
        intro={service.intro[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.services, href: `/${locale}${paths.services}` },
          { label: service.title[locale] },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary">
            {c.consult}
          </Link>
          <Link
            href={`/${locale}${paths.projects}?category=${service.id}`}
            className="link-arrow"
          >
            {c.viewProjects}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </PageHero>

      <section className="bg-white py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                  <Image
                    src={service.image}
                    alt={service.title[locale]}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                  <ServiceArt
                    variant={service.id as ServiceArtVariant}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              )}
              <p className="mt-3 text-[0.8125rem] text-ink-soft">{service.tagline[locale]}</p>
              {service.note ? (
                <p className="mt-6 max-w-[42ch] text-[1rem] leading-relaxed text-ink-soft">
                  {service.note[locale]}
                </p>
              ) : null}
            </Reveal>
          </div>

          <div id="pham-vi" className="scroll-mt-28 lg:col-span-6 lg:col-start-7">
            <Reveal delay={80}>
              <h2 className="display-2 max-w-[16ch] text-ink">{c.scope}</h2>
              <div className="mt-8 space-y-10">
                {service.scope.map((group) => (
                  <div key={group.title[locale]} className="card-enter">
                    <h3 className="display-4 text-ink">{group.title[locale]}</h3>
                    <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li
                          key={item[locale]}
                          className="flex gap-2.5 text-[1rem] leading-relaxed text-ink-soft"
                        >
                          <span aria-hidden className="mt-[0.68rem] h-px w-4 shrink-0 bg-accent" />
                          <span>{item[locale]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="wrap">
          <figure className="card-enter relative aspect-[21/8] overflow-hidden bg-sky">
            <Image
              src="/images/about/plant.jpg"
              alt={
                locale === "vi"
                  ? "Công trình công nghiệp đang vận hành"
                  : "Industrial facility in operation"
              }
              fill
              sizes="100vw"
              className="photo-drift object-cover"
            />
          </figure>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32">
              <p className="text-[0.8125rem] text-ink-soft">{c.contents}</p>
              <nav className="mt-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block py-2 text-[1rem] text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
              <div className="mt-10">
                <p className="text-[1rem] font-semibold text-ink">{c.contactTitle}</p>
                <p className="mt-2 max-w-[30ch] text-[1rem] leading-relaxed text-ink-soft">
                  {c.contactBody}
                </p>
                <a
                  href={`tel:${site.contact.hotline}`}
                  className="mt-4 inline-block text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {site.contact.hotlineDisplay}
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <div id="vai-tro" className="scroll-mt-28">
              <Reveal>
                <h2 className="display-2 max-w-[18ch] text-ink">
                  {locale === "vi" ? "Giá trị trong vận hành." : "Value in operation."}
                </h2>
                <ul className="card-enter mt-6 max-w-[62ch] space-y-4">
                  {service.role.map((item) => (
                    <li
                      key={item[locale]}
                      className="flex gap-3 text-[1rem] leading-[1.8] text-ink-soft"
                    >
                      <span aria-hidden className="mt-[0.72rem] h-px w-4 shrink-0 bg-accent" />
                      <span>{item[locale]}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div id="doi-tuong" className="mt-16 scroll-mt-28">
              <Reveal>
                <h2 className="display-2 max-w-[20ch] text-ink">{c.audiences}</h2>
                <div className="card-enter mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {service.audiences.map((audience) => (
                    <p
                      key={audience[locale]}
                      className="flex gap-3 text-[1rem] leading-relaxed text-ink-soft"
                    >
                      <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent" />
                      <span>{audience[locale]}</span>
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>

            <div id="quy-trinh" className="mt-16 scroll-mt-28">
              <Reveal>
                <h2 className="display-2 text-ink">{c.process}</h2>
                <ol className="card-enter mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {site.process.map((step) => (
                    <li key={step.title[locale]}>
                      <h3 className="text-[1rem] font-semibold text-ink">{step.title[locale]}</h3>
                      <p className="mt-1.5 text-[1rem] leading-relaxed text-ink-soft">
                        {step.body[locale]}
                      </p>
                    </li>
                  ))}
                </ol>
                {service.note ? (
                  <p className="mt-8 flex max-w-[62ch] gap-3 text-[1rem] leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent" />
                    <span>{service.note[locale]}</span>
                  </p>
                ) : null}
              </Reveal>
            </div>

            {related.length ? (
              <div id="du-an" className="mt-16 scroll-mt-28">
                <Reveal>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                    <h2 className="display-2 text-ink">{c.projects}</h2>
                    <Link
                      href={`/${locale}${paths.projects}?category=${service.id}`}
                      className="link-arrow"
                    >
                      {c.allProjects}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 [&_article]:mb-0">
                    {related.map((project, index) => (
                      <ProjectCard key={project.id} project={project} locale={locale} index={index} />
                    ))}
                  </div>
                </Reveal>
              </div>
            ) : null}

            <div className="mt-16">
              <p className="text-[0.8125rem] text-ink-soft">{c.otherServices}</p>
              <div className="card-enter mt-4 flex flex-wrap gap-x-10 gap-y-3">
                {others.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}${paths.services}/${item.slug}`}
                    className="link-arrow"
                  >
                    {item.shortTitle[locale]}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap card-enter flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="display-3 max-w-[20ch] text-white">{c.contactTitle}</h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white/65">{c.contactBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.consult}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(serviceJsonLd(service, site, locale)),
        }}
      />
    </>
  );
}
