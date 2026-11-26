import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { ContactForm } from "@/components/forms/contact-form";
import { OfficeMaps } from "@/components/contact/office-maps";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const gallery = [
  { src: "/images/about/plant.jpg", vi: "Nhà máy & hệ thống công nghiệp", en: "Plants & industrial systems" },
  { src: "/images/about/cooling.jpg", vi: "Tháp giải nhiệt & thiết bị", en: "Cooling towers & equipment" },
  { src: "/images/about/systems.jpg", vi: "Cơ điện & điều khiển", en: "M&E and controls" },
];

const copy = {
  vi: {
    title: "Trao đổi về công trình của bạn.",
    intro:
      "Gửi nhu cầu khảo sát, báo giá hoặc câu hỏi kỹ thuật. Đội ngũ Fansipan Group sẽ liên hệ để làm rõ phạm vi công việc và đề xuất bước tiếp theo.",
    hotline: "Hotline / Zalo",
    phone: "Điện thoại",
    email: "Email",
    zalo: "Chat Zalo",
    quote: "Yêu cầu báo giá / Khảo sát",
    quoteIntro:
      "Điền thông tin bên dưới để đội ngũ kỹ thuật liên hệ lại. Các trường có dấu * là bắt buộc.",
    offices: "Văn phòng & nhà xưởng",
    officesTitle: "Hai địa điểm, một đầu mối.",
    officesIntro:
      "Fansipan Group làm việc tại văn phòng Hà Nội và nhà xưởng Hưng Yên. Vui lòng liên hệ trước khi đến để được sắp xếp tiếp đón.",
    contactTitle: "Kênh liên hệ trực tiếp",
    careers: "Tuyển dụng",
    careersBody: "Xem vị trí đang tuyển và gửi hồ sơ trực tuyến.",
    profile: "Hồ sơ năng lực",
    profileBody: "Xem năng lực, dịch vụ và dự án tiêu biểu của Fansipan Group.",
    heroCaption: "Kỹ thuật & vận hành hệ thống · Ảnh minh họa",
    galleryNote: "Hình ảnh minh họa cho hạng mục công việc và hệ thống Fansipan Group triển khai.",
  },
  en: {
    title: "Let's talk about your facility.",
    intro:
      "Send a survey request, ask for a quotation or raise a technical question. Our team will contact you to clarify the scope and propose the next step.",
    hotline: "Hotline / Zalo",
    phone: "Phone",
    email: "Email",
    zalo: "Chat on Zalo",
    quote: "Request a quote / survey",
    quoteIntro:
      "Complete the form below and our engineering team will get back to you. Fields marked * are required.",
    offices: "Office & factory",
    officesTitle: "Two locations, one point of contact.",
    officesIntro:
      "Fansipan Group operates from our Hanoi office and Hung Yen factory. Please contact us in advance so we can arrange to receive you.",
    contactTitle: "Direct contact channels",
    careers: "Careers",
    careersBody: "View open positions and apply online.",
    profile: "Company profile",
    profileBody: "Explore Fansipan Group's capability, services and selected projects.",
    heroCaption: "Engineering & system operation · Illustrative image",
    galleryNote: "Images illustrate the type of work and the systems Fansipan Group delivers.",
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
    path: paths.contact,
    title: lang === "vi" ? "Liên hệ" : "Contact",
    description:
      lang === "vi"
        ? "Liên hệ Fansipan Group: hotline 0913 339 190, email sales.fansipan@gmail.com. Văn phòng Hà Nội, nhà xưởng Hưng Yên. Gửi yêu cầu báo giá và khảo sát."
        : "Contact Fansipan Group: hotline 0913 339 190, email sales.fansipan@gmail.com. Hanoi office, Hung Yen factory. Send a quote or survey request.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];
  const t = ui[locale];

  return (
    <>
      <section className="bg-white">
        <div className="wrap pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
                  <li>
                    <Link href={`/${locale}`} className="transition-colors hover:text-ink">
                      {t.nav.home}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-ink" aria-current="page">
                    {t.nav.contact}
                  </li>
                </ol>
              </nav>

              <h1 className="display-1 mt-10 max-w-3xl">{c.title}</h1>
              <p className="lead mt-7 max-w-2xl">{c.intro}</p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a href={`tel:${site.contact.hotline}`} className="btn btn-primary">
                  {site.contact.hotlineDisplay}
                </a>
                <a href={`mailto:${site.contact.email}`} className="link-arrow">
                  {site.contact.email}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden bg-sky">
                  <Image
                    src="/images/about/team.jpg"
                    alt={c.heroCaption}
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    priority
                    className="photo-drift object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[0.8125rem] text-muted">{c.heroCaption}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="quote" className="scroll-mt-28 bg-white py-20 lg:py-28">
        <div className="wrap">
          <div className="card-enter grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h2 className="display-2 text-ink lg:col-span-6">{c.quote}</h2>
            <p className="max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-8">
              {c.quoteIntro}
            </p>
          </div>

          <div className="card-enter mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[0.8125rem] text-ink-soft">{c.hotline}</p>
              <a
                href={`tel:${site.contact.hotline}`}
                className="mt-1 block text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                {site.contact.hotlineDisplay}
              </a>
            </div>
            <div>
              <p className="text-[0.8125rem] text-ink-soft">{c.phone}</p>
              <a
                href={`tel:${site.contact.phone}`}
                className="mt-1 block text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-[0.8125rem] text-ink-soft">{c.email}</p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-1 block break-all text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                {site.contact.email}
              </a>
            </div>
            <div>
              <p className="text-[0.8125rem] text-ink-soft">{c.zalo}</p>
              <a
                href={site.social.zalo || `https://zalo.me/${site.contact.zalo}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 block text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                {site.contact.hotlineDisplay}
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:gap-12">
            <Link href={`/${locale}${paths.careers}`} className="group block">
              <span className="text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
                {c.careers}
              </span>
              <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-soft">
                {c.careersBody}
              </span>
            </Link>
            <Link href={`/${locale}${paths.profile}`} className="group block">
              <span className="text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
                {c.profile}
              </span>
              <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-soft">
                {c.profileBody}
              </span>
            </Link>
          </div>

          <div className="mt-12">
            <ContactForm locale={locale} services={services} />
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="wrap">
          <div className="card-enter grid gap-6 sm:grid-cols-3">
            {gallery.map((item) => (
              <figure key={item.src} className="card-enter">
                <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                  <Image
                    src={item.src}
                    alt={locale === "vi" ? item.vi : item.en}
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="photo-drift object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-[0.8125rem] text-muted">
                  {locale === "vi" ? item.vi : item.en}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 max-w-xl text-[0.8125rem] text-muted">{c.galleryNote}</p>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap card-enter">
          <h2 className="display-2 max-w-[20ch] text-ink">{c.officesTitle}</h2>
          <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
            {c.officesIntro}
          </p>
          <div className="mt-12">
            <OfficeMaps locale={locale} site={site} mode="grid" />
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-[56ch] text-[1rem] leading-relaxed text-ink-soft">
              {site.contact.workingHours
                ? site.contact.workingHours
                : locale === "vi"
                  ? "Vui lòng liên hệ trước khi đến văn phòng hoặc nhà xưởng."
                  : "Please contact us before visiting the office or factory."}
            </p>
            <Link href={`/${locale}${paths.about}`} className="link-arrow shrink-0">
              {locale === "vi" ? "Tìm hiểu về Fansipan Group" : "More about Fansipan Group"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />
    </>
  );
}
