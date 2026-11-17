import Link from "next/link";
import { ArrowRight, Download } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    title: "Toàn bộ năng lực, trong một cuốn hồ sơ.",
    contents: "Năng lực & dịch vụ · Dự án tiêu biểu · Quy trình triển khai",
    online: "Xem trực tiếp",
    download: "Tải xuống PDF",
  },
  en: {
    title: "Our full capability, in one document.",
    contents: "Capabilities & services · Selected projects · Delivery process",
    online: "View online",
    download: "Download PDF",
  },
} as const;

export function CatalogueSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section id="ho-so-nang-luc" className="bg-brand-100 py-14 lg:py-16">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="display-3 max-w-[22ch] text-ink">
                {c.title}
              </h2>
              <p className="mt-2 text-[0.8125rem] text-ink/60">{c.contents}</p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href={`/${locale}${paths.profile}`} className="btn btn-dark">
                {c.online}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={site.catalogue.pdf}
                download
                className="link-arrow text-[1rem]"
              >
                <Download className="size-4" />
                {c.download}
              </a>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-[0.8125rem] leading-relaxed text-ink/55">
            {site.catalogue.note[locale]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
