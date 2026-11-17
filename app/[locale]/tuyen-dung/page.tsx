import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail } from "@/components/ui/icons";
import { JobsExplorer } from "@/components/careers/jobs-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getJobs, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Tuyển dụng",
    title: "Gia nhập đội ngũ.",
    intro:
      "Chúng tôi tìm kiếm những người làm kỹ thuật cẩn trọng, chủ động và muốn phát triển cùng các dự án công nghiệp của Fansipan Group.",
    positions: "vị trí đang mở",
    whyTitle: "Vì sao làm việc tại Fansipan Group?",
    whyIntro:
      "Môi trường kỹ thuật thực tế, phạm vi công việc rõ ràng và cơ hội học từ chính các công trình đang vận hành.",
    benefits: [
      {
        title: "Dự án công nghiệp đa dạng",
        body: "Hệ thống cơ điện, HVAC, tháp giải nhiệt và bảo trì tại nhà máy, khu công nghiệp trên nhiều địa bàn.",
      },
      {
        title: "Học từ đội ngũ kỹ thuật",
        body: "Làm việc cùng các kỹ sư có kinh nghiệm trong khảo sát, thiết kế, thi công và nghiệm thu.",
      },
      {
        title: "Phạm vi và trách nhiệm rõ ràng",
        body: "Công việc được xác định theo hồ sơ kỹ thuật, với yêu cầu an toàn và chất lượng cụ thể.",
      },
      {
        title: "Phát triển theo năng lực",
        body: "Cơ hội phát triển từ kỹ thuật viên đến kỹ sư, giám sát và quản lý dự án theo kinh nghiệm thực tế.",
      },
    ],
    rolesTitle: "Cơ hội đang mở.",
    generalTitle: "Không thấy vị trí phù hợp?",
    generalBody:
      "Bạn có thể gửi CV và giới thiệu ngắn về kinh nghiệm qua email tuyển dụng. Hồ sơ sẽ được lưu để xem xét khi có vị trí phù hợp.",
    generalCta: "Gửi CV qua email",
    noteTitle: "Lưu ý khi ứng tuyển",
    noteBody:
      "CV cần được đính kèm khi gửi hồ sơ qua website. Chúng tôi chỉ sử dụng thông tin trong hồ sơ cho mục đích tuyển dụng và không chia sẻ cho bên thứ ba.",
    privacy: "Chính sách bảo mật",
    caption: "Ảnh minh họa",
  },
  en: {
    eyebrow: "Careers",
    title: "Join the team.",
    intro:
      "We look for careful, self-driven technical people who want to grow with Fansipan Group's industrial projects.",
    positions: "open positions",
    whyTitle: "Why work at Fansipan Group?",
    whyIntro:
      "A hands-on engineering environment, clearly defined scope and the chance to learn from systems in live operation.",
    benefits: [
      {
        title: "Diverse industrial projects",
        body: "M&E, HVAC, cooling tower and maintenance systems in factories and industrial parks across several locations.",
      },
      {
        title: "Learn from our engineering team",
        body: "Work alongside experienced engineers in surveying, design, installation and commissioning.",
      },
      {
        title: "Clear scope and responsibility",
        body: "Work is defined by technical documents, with specific safety and quality requirements.",
      },
      {
        title: "Grow with capability",
        body: "A path from technician to engineer, supervisor and project manager based on practical experience.",
      },
    ],
    rolesTitle: "Open opportunities.",
    generalTitle: "No suitable position listed?",
    generalBody:
      "Send your CV and a short introduction of your experience to our recruitment email. We keep applications on file for future openings.",
    generalCta: "Email your CV",
    noteTitle: "Before you apply",
    noteBody:
      "A CV must be attached when applying through the website. We use the information in your application only for recruitment and do not share it with third parties.",
    privacy: "Privacy policy",
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
    path: paths.careers,
    title: lang === "vi" ? "Tuyển dụng" : "Careers",
    description:
      lang === "vi"
        ? "Cơ hội nghề nghiệp tại Fansipan Group trong lĩnh vực cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống. Xem vị trí đang tuyển và gửi hồ sơ trực tuyến."
        : "Career opportunities at Fansipan Group in M&E, HVAC, cooling towers and system maintenance. View open positions and apply online.",
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [jobs, site] = await Promise.all([getJobs(), getSite()]);
  const c = copy[locale];
  const openJobs = jobs.filter((job) => job.open);
  const mailHref = `mailto:${site.contact.careersEmail}?subject=${encodeURIComponent(
    locale === "vi" ? "Ứng tuyển Fansipan Group" : "Application to Fansipan Group",
  )}`;

  return (
    <>
      <section className="bg-white">
        <div className="wrap pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="card-enter lg:col-span-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
                  <li>
                    <Link href={`/${locale}`} className="transition-colors hover:text-ink">
                      {locale === "vi" ? "Trang chủ" : "Home"}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-ink" aria-current="page">
                    {c.eyebrow}
                  </li>
                </ol>
              </nav>

              <h1 className="display-1 mt-10 max-w-3xl">{c.title}</h1>
              <p className="lead mt-7 max-w-xl">{c.intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                <p className="text-[1rem] text-ink">
                  <span className="display-4">{openJobs.length}</span>{" "}
                  <span className="text-ink-soft">{c.positions}</span>
                </p>
                <a href={mailHref} className="link-arrow">
                  {site.contact.careersEmail}
                  <Mail className="size-4" />
                </a>
              </div>
            </div>

            <div className="card-enter lg:col-span-5 lg:col-start-8">
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden bg-sky">
                  <Image
                    src="/images/careers/panel.jpg"
                    alt={locale === "vi" ? "Kỹ thuật viên vận hành thiết bị" : "Technician operating equipment"}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    priority
                    className="photo-drift object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[0.8125rem] text-muted">{c.caption}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky-2 py-20 lg:py-28">
        <div className="wrap">
          <div className="grid gap-4 lg:grid-cols-12">
            <h2 className="display-2 lg:col-span-7">{c.whyTitle}</h2>
            <p className="lead max-w-xl lg:col-span-5">{c.whyIntro}</p>
          </div>

          <div className="card-enter mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/images/about/plant.jpg",
                alt: locale === "vi" ? "Nhà máy và hệ thống kỹ thuật" : "Plant and technical systems",
              },
              {
                src: "/images/careers/technicians.jpg",
                alt: locale === "vi" ? "Kỹ thuật viên tại công trình" : "Technicians on site",
              },
              {
                src: "/images/about/systems.jpg",
                alt: locale === "vi" ? "Hệ thống cơ điện đang vận hành" : "M&E systems in operation",
              },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-[3/2] overflow-hidden bg-sky-2">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="photo-drift object-cover"
                />
              </div>
            ))}
          </div>

          <div className="card-enter mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {c.benefits.map((benefit) => (
              <div key={benefit.title}>
                <h3 className="display-4 text-ink">{benefit.title}</h3>
                <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="wrap">
          <div className="card-enter flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="display-2 text-ink">{c.rolesTitle}</h2>
            <a href={mailHref} className="link-arrow">
              {c.generalCta}
              <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="mt-12">
            <JobsExplorer locale={locale} jobs={jobs} />
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="card-enter lg:col-span-7">
            <h2 className="display-2 max-w-[20ch] text-white">{c.generalTitle}</h2>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-white/70">
              {c.generalBody}
            </p>
            <a href={mailHref} className="btn btn-primary mt-8">
              <Mail className="size-4" />
              {c.generalCta}
            </a>
          </div>
          <div className="card-enter lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-[1rem] text-white">{c.noteTitle}</p>
            <p className="mt-3 max-w-[60ch] text-[0.8125rem] leading-relaxed text-white/70">{c.noteBody}</p>
            <Link
              href={`/${locale}${paths.privacy}`}
              className="link-arrow-light mt-5"
            >
              {c.privacy}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
