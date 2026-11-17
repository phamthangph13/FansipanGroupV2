import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { Flipbook } from "@/components/profile/flipbook";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Hồ sơ năng lực",
    title: "Một cuốn hồ sơ năng lực.",
    intro:
      "Đọc trực tiếp hồ sơ năng lực Fansipan Group hoặc tải PDF để lưu trữ và chia sẻ với đồng nghiệp, đối tác.",
    reader: "Đọc hồ sơ trực tuyến",
    readerIntro:
      "Sách lật trang hỗ trợ phím mũi tên, vuốt ngang và xem toàn màn hình. Bản PDF gốc có sẵn để tải xuống.",
    download: "Tải xuống PDF",
    contact: "Yêu cầu báo giá",
    stats: "Năng lực cốt lõi",
    inside: "Trong hồ sơ",
    insideIntro:
      "Tám trang tóm lược năng lực, dịch vụ, dự án tiêu biểu và quy trình triển khai của Fansipan Group.",
    chapters: [
      { number: "01", title: "Trang bìa", body: "Thông tin doanh nghiệp và lĩnh vực hoạt động." },
      { number: "02", title: "Giới thiệu", body: "Tầm nhìn, sứ mệnh và giá trị cốt lõi." },
      { number: "03", title: "Lĩnh vực hoạt động", body: "Bốn nhóm dịch vụ chính của Fansipan Group." },
      { number: "04", title: "Dịch vụ", body: "Phạm vi công việc cho cơ điện, HVAC, tháp giải nhiệt và bảo trì." },
      { number: "05", title: "Dự án tiêu biểu", body: "Mười một dự án trên bảy lĩnh vực công nghiệp." },
      { number: "06", title: "Quy trình", body: "Sáu bước từ tiếp nhận yêu cầu đến bàn giao và bảo trì." },
    ],
    ctaTitle: "Cần bản hồ sơ phù hợp với công trình của bạn?",
    ctaBody:
      "Đội ngũ Fansipan Group có thể trao đổi về phạm vi công việc, hồ sơ kỹ thuật và phương án triển khai riêng cho từng dự án.",
    servicesTitle: "Bốn lĩnh vực trong hồ sơ",
    servicesIntro:
      "Mỗi lĩnh vực được triển khai theo cùng một chuẩn: khảo sát kỹ, thi công chuẩn và bàn giao rõ ràng.",
    viewService: "Xem dịch vụ",
    updated: "Phiên bản 2026",
    pdfNote: "PDF · 8 trang · Tiếng Việt",
    insideTitle: "Sáu phần, một mạch năng lực.",
    caption: "Ảnh minh họa",
  },
  en: {
    eyebrow: "Company profile",
    title: "One capability profile.",
    intro:
      "Read the Fansipan Group company profile online or download the PDF to keep and share with colleagues and partners.",
    reader: "Read the profile online",
    readerIntro:
      "The page-turning view supports arrow keys, swipe and full screen. The original PDF is available to download.",
    download: "Download PDF",
    contact: "Request a quote",
    stats: "Core capability",
    inside: "Inside the profile",
    insideIntro:
      "Eight pages summarising Fansipan Group's capability, services, selected projects and delivery process.",
    chapters: [
      { number: "01", title: "Cover", body: "Company information and areas of activity." },
      { number: "02", title: "Introduction", body: "Vision, mission and core values." },
      { number: "03", title: "Areas of activity", body: "Fansipan Group's four main service groups." },
      { number: "04", title: "Services", body: "Scope of work for M&E, HVAC, cooling towers and maintenance." },
      { number: "05", title: "Selected projects", body: "Eleven projects across seven industrial sectors." },
      { number: "06", title: "Process", body: "Six steps from enquiry to handover and maintenance." },
    ],
    ctaTitle: "Need a profile tailored to your facility?",
    ctaBody:
      "The Fansipan Group team can discuss the scope of work, technical documents and a delivery approach specific to your project.",
    servicesTitle: "Four disciplines in the profile",
    servicesIntro:
      "Every discipline follows the same standard: a thorough survey, disciplined installation and a clear handover.",
    viewService: "View service",
    updated: "2026 edition",
    pdfNote: "PDF · 8 pages · Vietnamese",
    insideTitle: "Six parts, one capability story.",
    caption: "Illustrative image",
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
    path: paths.profile,
    title: lang === "vi" ? "Hồ sơ năng lực" : "Company profile",
    description:
      lang === "vi"
        ? "Hồ sơ năng lực Fansipan Group: năng lực cơ điện, HVAC, tháp giải nhiệt, bảo trì hệ thống, dự án tiêu biểu và quy trình triển khai. Đọc trực tuyến hoặc tải PDF."
        : "Fansipan Group company profile: M&E, HVAC, cooling tower and maintenance capability, selected projects and delivery process. Read online or download the PDF.",
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];

  return (
    <>
      <PageHero
        locale={locale}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: locale === "vi" ? "Trang chủ" : "Home", href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={site.catalogue.pdf} download className="btn btn-primary">
            {c.download}
          </a>
          <Link href={`/${locale}${paths.contact}#quote`} className="link-arrow">
            {c.contact}
            <ArrowRight className="size-4" />
          </Link>
          <span className="text-[0.8125rem] text-ink-soft">{c.pdfNote}</span>
        </div>
      </PageHero>

      <section className="bg-white">
        <div className="wrap">
          <figure className="card-enter">
            <div className="relative aspect-[21/9] overflow-hidden bg-sky">
              <Image
                src="/images/about/cooling.jpg"
                alt={
                  locale === "vi"
                    ? "Hệ thống tháp giải nhiệt tại công trình"
                    : "Cooling tower system at a facility"
                }
                fill
                sizes="100vw"
                priority
                className="photo-drift object-cover"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap card-enter grid gap-10 sm:grid-cols-3 sm:gap-8">
          {site.stats.map((stat) => (
            <div key={stat.label.vi}>
              <p className="display-2 text-brand">{stat.value}</p>
              <p className="mt-2 text-[1rem] text-ink-soft">{stat.label[locale]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="doc" className="scroll-mt-28 bg-sky-2 py-20 lg:py-24">
        <div className="wrap">
          <div className="card-enter flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="max-w-2xl">
              <h2 className="display-2 text-ink">{site.catalogue.title[locale]}</h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{c.readerIntro}</p>
            </div>
            <span className="text-[0.8125rem] text-ink-soft">{c.updated}</span>
          </div>

          <div className="card-enter mt-10">
            <Flipbook
              locale={locale}
              pdfUrl={site.catalogue.pdf}
              title={site.catalogue.title[locale]}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="display-2 max-w-[14ch] text-ink">{c.insideTitle}</h2>
            <p className="mt-4 max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
              {c.insideIntro}
            </p>
            <a href={site.catalogue.pdf} download className="link-arrow mt-6">
              {c.download}
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="card-enter grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {c.chapters.map((chapter) => (
              <div key={chapter.title}>
                <h3 className="display-4 text-ink">{chapter.title}</h3>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{chapter.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-24">
        <div className="wrap">
          <div className="card-enter flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="max-w-xl">
              <h2 className="display-2 text-ink">
                {locale === "vi" ? "Từ thiết kế đến vận hành." : "From design to operation."}
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{c.servicesIntro}</p>
            </div>
            <Link href={`/${locale}${paths.services}`} className="link-arrow">
              {locale === "vi" ? "Xem tất cả dịch vụ" : "View all services"}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="card-enter mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/${locale}${paths.services}/${service.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title[locale]}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="photo-drift object-cover"
                    />
                  ) : null}
                </div>
                <h3 className="display-4 mt-5 text-ink transition-colors group-hover:text-brand">
                  {service.shortTitle[locale]}
                </h3>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                  {service.tagline[locale]}
                </p>
                <span className="link-arrow mt-4 inline-flex">
                  {c.viewService}
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="wrap card-enter flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="display-3 max-w-[22ch] text-white">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white/65">{c.ctaBody}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2">
              <a
                href={`tel:${site.contact.hotline}`}
                className="text-[1rem] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {site.contact.hotlineDisplay}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="text-[1rem] text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
              >
                {site.contact.email}
              </a>
            </div>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.contact}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
