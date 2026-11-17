import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { Reveal } from "@/components/ui/reveal";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Dịch vụ",
    title: "Dịch vụ & lĩnh vực hoạt động",
    intro:
      "Bốn lĩnh vực được tổ chức quanh cùng một mục tiêu: hệ thống vận hành ổn định, an toàn và hiệu quả trong suốt vòng đời công trình.",
    detail: "Xem chi tiết dịch vụ",
    consult: "Yêu cầu tư vấn",
    process: "Quy trình chung",
    processTitle: "Sáu bước, kiểm soát từ đầu.",
    processIntro:
      "Mỗi dịch vụ được triển khai theo quy trình sáu bước, điều chỉnh theo phạm vi và điều kiện thực tế của công trình.",
    ctaTitle: "Chưa chắc dịch vụ nào phù hợp?",
    ctaBody:
      "Mô tả ngắn hiện trạng hoặc mục tiêu vận hành, đội ngũ kỹ thuật sẽ giúp xác định phạm vi phù hợp.",
  },
  en: {
    eyebrow: "Services",
    title: "Services & disciplines",
    intro:
      "Four disciplines organised around one objective: systems that run reliably, safely and efficiently throughout the project lifecycle.",
    detail: "View service details",
    consult: "Request consultation",
    process: "Common process",
    processTitle: "Six steps, controlled throughout.",
    processIntro:
      "Every service follows a six-step delivery process, adapted to the actual scope and conditions of the project.",
    ctaTitle: "Not sure which service fits?",
    ctaBody:
      "Describe the current situation or operating objective; our engineering team will help define the right scope.",
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
    path: paths.services,
    title: lang === "vi" ? "Dịch vụ" : "Services",
    description:
      lang === "vi"
        ? "Các lĩnh vực hoạt động của Fansipan Group: hệ thống điều hòa – làm lạnh (HVAC), cơ điện (M&E), tháp giải nhiệt & thiết bị công nghiệp, bảo trì chuyên nghiệp."
        : "Fansipan Group services: HVAC & refrigeration, M&E systems, cooling towers & industrial equipment, and professional maintenance.",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [services, site] = await Promise.all([getServices(), getSite()]);
  const c = copy[locale];
  const t = ui[locale];

  return (
    <>
      <PageHero
        locale={locale}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.services },
        ]}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="inline-flex min-h-11 items-center text-[1rem] text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              {service.shortTitle[locale]}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="bg-white">
        {services.map((service, index) => (
          <section key={service.id} id={service.id} className="scroll-mt-28 py-20 lg:py-24">
            <div className="wrap grid items-center gap-10 lg:grid-cols-12 lg:gap-12 card-enter">
              <Reveal
                className={cn(
                  "lg:col-span-5",
                  index % 2 === 1 ? "lg:order-2 lg:col-start-8" : "lg:order-1",
                )}
              >
                {service.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                    <Image
                      src={service.image}
                      alt={service.title[locale]}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="photo-drift object-cover"
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
              </Reveal>

              <div
                className={cn(
                  "lg:col-span-6",
                  index % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-7",
                )}
              >
                <Reveal delay={80}>
                  <h2 className="display-3 text-ink">{service.title[locale]}</h2>
                  <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                    {service.intro[locale]}
                  </p>

                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {service.role.slice(0, 4).map((item) => (
                      <li
                        key={item[locale]}
                        className="flex gap-2.5 text-[1rem] leading-relaxed text-ink-soft"
                      >
                        <span aria-hidden className="mt-[0.62rem] h-px w-4 shrink-0 bg-accent" />
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
                    <Link
                      href={`/${locale}${paths.services}/${service.slug}`}
                      className="link-arrow"
                    >
                      {c.detail}
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href={`/${locale}${paths.contact}#quote`}
                      className="inline-flex items-center gap-1.5 text-[1rem] text-muted transition-colors hover:text-ink"
                    >
                      {c.consult}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-sky-2 py-20 lg:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="display-3 text-ink">{c.processTitle}</h2>
            <p className="mt-5 max-w-[34ch] text-[1rem] leading-relaxed text-ink-soft">
              {c.processIntro}
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {site.process.map((step) => (
                <li key={step.title[locale]}>
                  <h3 className="display-4 text-ink">{step.title[locale]}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                    {step.body[locale]}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="display-3 max-w-[18ch] text-white">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white/65">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {t.actions.quote}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
