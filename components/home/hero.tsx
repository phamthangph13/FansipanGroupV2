import Link from "next/link";
import { ArrowDown, ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";
import { HeroCrossfade, type HeroFrame } from "./hero-crossfade";

const copy = {
  vi: {
    support:
      "Nhà thầu cơ điện, HVAC và bảo trì hệ thống cho nhà máy và khu công nghiệp.",
    disciplines: "Cơ điện · HVAC · Tháp giải nhiệt · Bảo trì",
    action: "Yêu cầu báo giá / Khảo sát",
    scroll: "Cuộn xuống",
    frames: [
      { src: "/images/about/cooling.jpg", alt: "Hệ thống tháp giải nhiệt và đường ống tại nhà máy" },
      { src: "/images/projects/pullman-ha-noi.jpg", alt: "Khách sạn Pullman Hà Nội nhìn từ phố" },
      { src: "/images/about/plant.jpg", alt: "Tháp giải nhiệt nhà máy nhiệt điện về đêm" },
    ],
  },
  en: {
    support:
      "An M&E, HVAC and system maintenance contractor for factories and industrial parks.",
    disciplines: "M&E · HVAC · Cooling towers · Maintenance",
    action: "Request a quote / survey",
    scroll: "Scroll",
    frames: [
      { src: "/images/about/cooling.jpg", alt: "Cooling towers and pipework at an industrial plant" },
      { src: "/images/projects/pullman-ha-noi.jpg", alt: "Pullman Hanoi hotel seen from the street" },
      { src: "/images/about/plant.jpg", alt: "Cooling towers of a thermal power plant at night" },
    ],
  },
} as const satisfies Record<
  Locale,
  { support: string; disciplines: string; action: string; scroll: string; frames: HeroFrame[] }
>;

export function Hero({ locale, site }: { locale: Locale; site: SiteData }) {
  const t = ui[locale];
  const c = copy[locale];

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-navy text-white lg:h-[100svh]">
      <div className="absolute inset-0" aria-hidden>
        <HeroCrossfade frames={[...c.frames]} />
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[78%] bg-[linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.42)_55%,transparent_82%)]" />
      </div>

      <div className="wrap relative flex h-full min-h-[640px] flex-col justify-end pb-14 pt-36 lg:min-h-0 lg:pb-16">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="max-w-[9ch] font-display text-[clamp(2.9rem,9.5vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em] text-white lg:text-[clamp(2.9rem,4.2vw,4.15rem)]">
                Fansipan
                <br />
                Group
              </h1>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <Reveal delay={120}>
              <p className="lead max-w-[36ch] text-white lg:text-right">{c.support}</p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-3 text-[0.8125rem] text-white/85 lg:text-right">
                {c.disciplines}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 lg:flex lg:justify-end">
                <Link
                  href={`/${locale}${paths.contact}#quote`}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {c.action}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-white/65 lg:flex">
        <span className="text-[0.8125rem]">{c.scroll}</span>
        <ArrowDown className="size-3.5 animate-bounce [animation-duration:2.2s]" strokeWidth={1.4} />
      </div>

      <div className="sr-only">
        <p>
          {site.company.displayName} — {site.company.slogan[locale]}.
        </p>
        <p>{t.nav.profile}</p>
      </div>
    </section>
  );
}
