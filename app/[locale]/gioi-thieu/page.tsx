import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Logo } from "@/components/brand/logo";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { StatsBand } from "@/components/home/stats";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { splitParagraphs } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Giới thiệu",
    title: "Về Fansipan Group",
    intro:
      "Fansipan Group – Chuyên gia Cơ điện (M&E), HVAC, tháp giải nhiệt và bảo trì hệ thống.",
    overview: "Tổng quan công ty",
    overviewTitle: "Một đầu mối, trọn vòng đời hệ thống.",
    overviewBody:
      "Chuyên gia Cơ điện (M&E) – Hệ thống điều hòa không khí & Làm lạnh (HVAC) – Tháp giải nhiệt & Thiết bị công nghiệp – Dịch vụ bảo trì chuyên nghiệp",
    difference: "Điểm khác biệt",
    differenceTitle: "Kỹ thuật vững, dịch vụ tận tâm.",
    vision: "Tầm nhìn",
    mission: "Sứ mệnh",
    values: "Giá trị cốt lõi",
    valuesTitle:
      "Sáu giá trị cốt lõi.",
    capability: "Năng lực công ty",
    capabilityTitle: "Một vòng đời, bốn lĩnh vực.",
    capabilityIntro:
      "Năng lực của Fansipan Group được tổ chức theo vòng đời công trình: tư vấn – thiết kế – cung cấp thiết bị – thi công – chạy thử – bàn giao – bảo trì.",
    ctaTitle: "Cần trao đổi về một hệ thống cụ thể?",
    ctaBody:
      "Gửi thông tin công trình hoặc liên hệ hotline để đội ngũ kỹ thuật trao đổi trước khi khảo sát.",
    cta: "Liên hệ đội ngũ kỹ thuật",
    services: "Xem dịch vụ",
    legal: "Hồ sơ pháp lý",
    taxCode: "Mã số thuế",
    address: "Địa chỉ",
    email: "Email",
    hotline: "Hotline",
    profile: "Hồ sơ năng lực",
    differences: [
      {
        title: "Giải pháp toàn diện",
        body: "Từ tư vấn, thiết kế, cung cấp thiết bị, thi công đến vận hành và bảo trì — một đầu mối xuyên suốt vòng đời hệ thống.",
      },
      {
        title: "Chuyên môn kỹ thuật",
        body: "Kinh nghiệm trên hệ thống cơ điện, HVAC, tháp giải nhiệt và thiết bị công nghiệp tại nhà máy, khu công nghiệp.",
      },
      {
        title: "Đồng hành dài hạn",
        body: "Bảo trì chủ động giúp duy trì hiệu suất, hạn chế gián đoạn và kéo dài tuổi thọ thiết bị.",
      },
      {
        title: "Minh bạch & an toàn",
        body: "Phạm vi công việc, vật tư và tiến độ được xác định rõ; an toàn được kiểm soát tại từng hạng mục.",
      },
    ],
  },
  en: {
    eyebrow: "About",
    title: "About Fansipan Group",
    intro:
      "Fansipan Group – specialists in M&E, HVAC, cooling towers and system maintenance.",
    overview: "Company overview",
    overviewTitle: "One partner across the system lifecycle.",
    overviewBody:
      "M&E specialists – HVAC systems – Cooling towers & industrial equipment – Professional maintenance services",
    difference: "What sets us apart",
    differenceTitle: "Strong engineering, attentive service.",
    vision: "Vision",
    mission: "Mission",
    values: "Core values",
    valuesTitle: "Six core values.",
    capability: "Company capability",
    capabilityTitle: "One lifecycle, four disciplines.",
    capabilityIntro:
      "Our capability is organised around the project lifecycle: consultancy – design – equipment supply – installation – commissioning – handover – maintenance.",
    ctaTitle: "Need to discuss a specific system?",
    ctaBody:
      "Send your project information or call our hotline. Our engineering team will discuss the requirement before any survey.",
    cta: "Contact our engineering team",
    services: "View services",
    legal: "Legal profile",
    taxCode: "Tax code",
    address: "Address",
    email: "Email",
    hotline: "Hotline",
    profile: "Company profile",
    differences: [
      {
        title: "Integrated solutions",
        body: "From consultancy, design and equipment supply to installation, operation and maintenance — one partner across the system lifecycle.",
      },
      {
        title: "Technical expertise",
        body: "Experience across M&E, HVAC, cooling towers and industrial equipment in factories and industrial parks.",
      },
      {
        title: "Long-term partnership",
        body: "Proactive maintenance sustains performance, reduces downtime and extends equipment life.",
      },
      {
        title: "Transparency & safety",
        body: "Scope, materials and schedule are clearly defined, with safety controlled at every work item.",
      },
    ],
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
    path: paths.about,
    title: lang === "vi" ? "Giới thiệu" : "About us",
    description:
      lang === "vi"
        ? "Fansipan Group – chuyên gia Cơ điện (M&E), HVAC, tháp giải nhiệt và bảo trì hệ thống. Tầm nhìn, sứ mệnh, giá trị cốt lõi và năng lực công ty."
        : "Fansipan Group – specialists in M&E, HVAC, cooling towers and system maintenance. Our vision, mission, values and company capability.",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];
  const t = ui[locale];
  const paragraphs = splitParagraphs(site.about.intro[locale]);

  return (
    <>
      <PageHero
        locale={locale}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.about },
        ]}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8 card-enter">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="display-2 max-w-[18ch] text-ink">{c.overviewTitle}</h2>
              <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
                {c.overviewBody}
              </p>
            </Reveal>
            <div className="mt-8 max-w-[62ch] space-y-5">
              {paragraphs.map((paragraph, index) => {
                const last = index === paragraphs.length - 1;
                return (
                  <Reveal key={paragraph.slice(0, 32)} delay={80 + index * 60}>
                    <p
                      className={
                        last
                          ? "display-4 leading-snug text-ink"
                          : "text-[1rem] leading-[1.8] text-ink-soft"
                      }
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={120}>
              <div className="bg-brand-050 p-6 sm:p-8">
                <Logo size="md" />
                <p className="mt-8 text-[0.8125rem] text-ink-soft">{c.legal}</p>
                <p className="mt-2 text-[1rem] font-semibold leading-snug text-ink">
                  {site.company.legalName[locale]}
                </p>
                <p className="mt-1 text-[0.8125rem] text-ink-soft">{site.company.displayName}</p>

                <dl className="mt-7 space-y-5">
                  <div>
                    <dt className="text-[0.8125rem] text-ink-soft">{c.taxCode}</dt>
                    <dd className="mt-1 text-[1rem] text-ink">
                      {site.company.taxCode || t.labels.updating}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] text-ink-soft">{c.address}</dt>
                    <dd className="mt-1 text-[1rem] leading-relaxed text-ink">
                      {site.offices[0]?.address[locale]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] text-ink-soft">{c.email}</dt>
                    <dd className="mt-1 text-[1rem] text-ink">
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="break-all underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        {site.contact.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] text-ink-soft">{c.hotline}</dt>
                    <dd className="mt-1 text-[1rem] text-ink">{site.contact.hotlineDisplay}</dd>
                  </div>
                </dl>

                <Link href={`/${locale}${paths.profile}`} className="link-arrow mt-7">
                  {c.profile}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8 card-enter">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="display-3 text-ink">{c.differenceTitle}</h2>
            </Reveal>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {c.differences.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <h3 className="display-4 text-ink">{item.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-8 card-enter">
          <div>
            <Reveal>
              <h2 className="display-2 text-white">{c.vision}</h2>
              <div className="mt-6 space-y-5">
                {site.about.vision.map((item) => (
                  <p key={item[locale]} className="max-w-[56ch] text-[1rem] leading-[1.8] text-white/70">
                    {item[locale]}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:pl-10">
            <Reveal delay={100}>
              <h2 className="display-2 text-white">{c.mission}</h2>
              <div className="mt-6 space-y-5">
                {site.about.mission.map((item) => (
                  <p key={item[locale]} className="max-w-[56ch] text-[1rem] leading-[1.8] text-white/70">
                    {item[locale]}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="wrap card-enter">
          <SectionHeading title={c.valuesTitle} />
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {site.about.values.map((value, index) => (
              <Reveal key={value.title[locale]} delay={index * 60}>
                <h3 className="display-4 text-ink">{value.title[locale]}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
                  {value.body[locale]}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap card-enter">
          <SectionHeading
            title={c.capabilityTitle}
            intro={c.capabilityIntro}
            action={
              <Link href={`/${locale}${paths.services}`} className="link-arrow">
                {c.services}
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {services.map((service) => (
              <Reveal key={service.id}>
                <Link
                  href={`/${locale}${paths.services}/${service.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-sky">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.title[locale]}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="photo-drift object-cover"
                      />
                    ) : (
                      <ServiceArt
                        variant={service.id as ServiceArtVariant}
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                  <h3 className="display-3 mt-4 text-ink transition-colors group-hover:text-brand">
                    {service.title[locale]}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
                    {service.short[locale]}
                  </p>
                  <span className="link-arrow mt-3 inline-flex">
                    {t.actions.viewDetail}
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsBand locale={locale} site={site} />

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
