import Link from "next/link";
import { ArrowRight, Download } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import { getCapabilityDocs } from "@/lib/content";
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

export async function CatalogueSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];
  const docs = await getCapabilityDocs();
  const primaryProfile = docs.find((doc) => doc.kind === "profile") ?? docs[0];
  const pdfUrl = primaryProfile?.file || site.catalogue.pdf;

  return (
    <section id="ho-so-nang-luc" className="bg-brand-100 py-14 lg:py-16">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Editable
                k="home.catalogue.title"
                locale={locale}
                fallback={c.title}
                as="h2"
                className="display-3 max-w-[22ch] text-ink"
                multiline
              />
              <Editable
                k="home.catalogue.contents"
                locale={locale}
                fallback={c.contents}
                as="p"
                className="mt-2 text-[0.8125rem] text-ink/60"
                multiline
              />
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href={`/${locale}${paths.profile}`} className="btn btn-dark">
                <Editable
                  k="home.catalogue.online"
                  locale={locale}
                  fallback={c.online}
                  as="span"
                />
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={pdfUrl}
                download
                className="link-arrow text-[1rem]"
              >
                <Download className="size-4" />
                <Editable
                  k="home.catalogue.download"
                  locale={locale}
                  fallback={c.download}
                  as="span"
                />
              </a>
            </div>
          </div>
          <Editable
            k="home.catalogue.note"
            locale={locale}
            fallback={site.catalogue.note[locale]}
            as="p"
            className="mt-6 max-w-2xl text-[0.8125rem] leading-relaxed text-ink/55"
            multiline
          />
        </Reveal>
      </div>
    </section>
  );
}
