import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import { EditableImage } from "@/components/editor/editable-image";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    title: "Trao đổi về công trình của bạn.",
    intro:
      "Gửi nhu cầu khảo sát, báo giá hoặc câu hỏi kỹ thuật. Đội ngũ Fansipan Group sẽ liên hệ để làm rõ phạm vi công việc và đề xuất bước tiếp theo.",
    action: "Yêu cầu báo giá / Khảo sát",
    hotline: "Hotline / Zalo",
    email: "Email",
    hours: "Giờ làm việc",
  },
  en: {
    title: "Let's talk about your facility.",
    intro:
      "Send a survey request, ask for a quotation or raise a technical question. Our team will contact you to clarify the scope and propose the next step.",
    action: "Request a quote / survey",
    hotline: "Hotline / Zalo",
    email: "Email",
    hours: "Working hours",
  },
} as const;

export function ContactSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section id="lien-he" className="bg-navy py-24 text-white lg:py-32">
      <div className="wrap grid items-end gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <Editable
              k="home.contact.title"
              locale={locale}
              fallback={c.title}
              as="h2"
              className="display-2 max-w-[15ch] text-white"
              multiline
            />
          </Reveal>
          <Reveal delay={100}>
            <Editable
              k="home.contact.intro"
              locale={locale}
              fallback={c.intro}
              as="p"
              className="mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-white/65"
              multiline
            />
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:gap-16">
              <div>
                <a
                  href={`tel:${site.contact.hotline}`}
                  className="display-3 inline-flex items-center gap-2 leading-none text-white underline decoration-accent decoration-2 underline-offset-[10px] transition-colors hover:text-accent"
                >
                  {site.contact.hotlineDisplay}
                </a>
                <p className="mt-2 text-[0.8125rem] text-white/65">
                  <Editable
                    k="home.contact.hotline"
                    locale={locale}
                    fallback={c.hotline}
                    as="span"
                  />
                </p>
              </div>
              <div>
                <p className="text-[0.8125rem] text-white/65">
                  <Editable k="home.contact.email" locale={locale} fallback={c.email} as="span" />
                </p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="mt-1 inline-flex items-baseline gap-2 text-[1rem] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {site.contact.email}
                  <ArrowUpRight className="size-3.5 shrink-0 self-center" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
              <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary">
                <Editable k="home.contact.action" locale={locale} fallback={c.action} as="span" />
                <ArrowRight className="size-4" />
              </Link>
              <p className="text-[0.8125rem] text-white/65">
                <Editable k="home.contact.hours" locale={locale} fallback={c.hours} as="span" />:{" "}
                {site.contact.workingHours}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-4 lg:col-start-9" delay={160}>
          <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-navy-2 lg:ml-auto">
            <EditableImage
              k="home.contact.image"
              src="/images/about/systems.jpg"
              alt={
                locale === "vi"
                  ? "Kỹ sư Fansipan Group kiểm tra tủ điện tại công trình"
                  : "Fansipan Group engineer inspecting a switchboard on site"
              }
              fill
              sizes="(min-width: 1024px) 320px, 80vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
