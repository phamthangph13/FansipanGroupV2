import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import { EditableImage } from "@/components/editor/editable-image";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    title: "Cơ điện, HVAC và bảo trì hệ thống.",
    intro:
      "Fansipan Group cung cấp giải pháp cơ điện toàn diện, từ tư vấn, thiết kế, cung cấp thiết bị, thi công đến vận hành và bảo trì hệ thống.",
    overlay:
      "Đội ngũ kỹ sư giàu kinh nghiệm, quy trình chuyên nghiệp: tối ưu hiệu suất, tiết kiệm năng lượng và kéo dài tuổi thọ thiết bị.",
    more: "Tìm hiểu về Fansipan Group",
    sectors: "Lĩnh vực công nghiệp",
    offices: "Hà Nội · Hưng Yên",
  },
  en: {
    title: "M&E, HVAC and system maintenance.",
    intro:
      "Fansipan Group delivers integrated M&E solutions, from consultancy, design and equipment supply to installation, operation and system maintenance.",
    overlay:
      "An experienced engineering team and disciplined processes: optimised performance, energy savings and longer equipment life.",
    more: "More about Fansipan Group",
    sectors: "Industrial sectors",
    offices: "Hanoi · Hung Yen",
  },
} as const;

export function AboutSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="wrap">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Editable
                k="home.about.title"
                locale={locale}
                fallback={c.title}
                as="h2"
                className="display-2 max-w-[24ch]"
                multiline
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 lg:mt-10">
                <Link href={`/${locale}${paths.about}`} className="link-arrow">
                  <Editable
                    k="home.about.more"
                    locale={locale}
                    fallback={c.more}
                    as="span"
                  />
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <Editable
                k="home.about.intro"
                locale={locale}
                fallback={c.intro}
                as="p"
                className="lead"
                multiline
              />
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-8" delay={120}>
            <div className="relative aspect-[16/10] overflow-hidden bg-sky">
              <EditableImage
                k="home.about.image"
                src="/images/about/team.jpg"
                alt={
                  locale === "vi"
                    ? "Đội ngũ kỹ thuật Fansipan Group tại công trình"
                    : "Fansipan Group engineering team on site"
                }
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute right-0 top-0 hidden max-w-[340px] bg-white p-5 text-[1rem] leading-relaxed text-ink-soft lg:block">
                <Editable
                  k="home.about.overlay"
                  locale={locale}
                  fallback={c.overlay}
                  as="span"
                  multiline
                />
              </div>
            </div>
            <p className="mt-5 max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft lg:hidden">
              <Editable
                k="home.about.overlay"
                locale={locale}
                fallback={c.overlay}
                as="span"
                multiline
              />
            </p>
          </Reveal>

          <div className="lg:col-span-4">
            <Reveal delay={200}>
              <div className="relative aspect-[4/3] bg-brand-100">
                <svg
                  viewBox="0 0 400 280"
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden
                >
                  <rect x="64" y="70" width="120" height="86" stroke="#182C46" strokeWidth="1.4" />
                  <rect x="226" y="128" width="108" height="76" stroke="#182C46" strokeWidth="1.4" />
                  <path d="M184 113h42" stroke="#182C46" strokeWidth="1.4" />
                  <path d="M64 70h120v86H64z" fill="none" />
                  <path d="M96 70v86M64 113h120" stroke="#182C46" strokeWidth="0.6" opacity="0.5" />
                  <path d="M256 128v76M226 166h108" stroke="#182C46" strokeWidth="0.6" opacity="0.5" />
                  <circle cx="124" cy="113" r="5" fill="#FF9E2C" />
                  <circle cx="286" cy="166" r="4" fill="#182C46" />
                </svg>
              </div>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                <Editable
                  k="home.about.offices"
                  locale={locale}
                  fallback={c.offices}
                  as="span"
                />
              </p>
              <div className="mt-6">
                <p className="text-[0.8125rem] text-muted">
                  <Editable
                    k="home.about.sectorsLabel"
                    locale={locale}
                    fallback={c.sectors}
                    as="span"
                  />
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                  <Editable
                    k="home.about.sectors"
                    locale={locale}
                    fallback={site.sectors.map((sector) => sector[locale]).join(" · ")}
                    as="span"
                    multiline
                  />
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
