import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Editable } from "@/components/editor/editable";
import { paths, type Locale } from "@/lib/i18n";
import type { Job } from "@/lib/types";

const copy = {
  vi: {
    title: "Gia nhập đội ngũ Fansipan Group.",
    intro:
      "Chúng tôi tìm kiếm những người làm kỹ thuật cẩn trọng, chủ động và muốn phát triển cùng các dự án công nghiệp.",
    cta: "Xem vị trí đang tuyển",
    open: "vị trí đang tuyển",
  },
  en: {
    title: "Join the Fansipan Group team.",
    intro:
      "We look for careful, self-driven technical people who want to grow with industrial projects.",
    cta: "See open positions",
    open: "open positions",
  },
} as const;

export function CareersTeaser({ locale, jobs }: { locale: Locale; jobs: Job[] }) {
  const c = copy[locale];
  const openJobs = jobs.filter((job) => job.open);

  return (
    <section id="tuyen-dung" className="bg-sky-2 py-20 lg:py-28">
      <div className="wrap grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Reveal>
            <Editable
              k="home.careers.title"
              locale={locale}
              fallback={c.title}
              as="h2"
              className="display-2 max-w-[18ch] text-ink"
              multiline
            />
          </Reveal>
          <Reveal delay={100}>
            <Editable
              k="home.careers.intro"
              locale={locale}
              fallback={c.intro}
              as="p"
              className="mt-6 max-w-[44ch] text-[1rem] leading-relaxed text-ink-soft"
              multiline
            />
          </Reveal>
          <Reveal delay={180}>
            <Link href={`/${locale}${paths.careers}`} className="link-arrow mt-8">
              <Editable k="home.careers.cta" locale={locale} fallback={c.cta} as="span" />
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal delay={140}>
            <p className="text-[0.8125rem] text-muted">
              <span className="text-ink">{openJobs.length}</span>{" "}
              <Editable k="home.careers.open" locale={locale} fallback={c.open} as="span" />
            </p>
            <ul className="mt-6">
              {openJobs.slice(0, 4).map((job) => (
                <li key={job.slug} className="mt-6 first:mt-0">
                  <Link
                    href={`/${locale}${paths.careers}/${job.slug}`}
                    className="group flex items-start justify-between gap-6"
                  >
                    <span>
                      <span className="block display-4 text-ink transition-colors group-hover:text-brand">
                        {job.title[locale]}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] text-muted">
                        {job.location[locale]} · {job.type[locale]}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="mt-1 size-4 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
