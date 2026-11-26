import Link from "next/link";
import { Editable } from "@/components/editor/editable";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function Footer({ locale, site }: { locale: Locale; site: SiteData }) {
  const year = new Date().getFullYear();
  const vi = locale === "vi";

  const nav = [
    { label: vi ? "Giới thiệu" : "About", href: paths.about, key: "nav.about" },
    { label: vi ? "Dịch vụ" : "Services", href: paths.services, key: "nav.services" },
    { label: vi ? "Dự án" : "Projects", href: paths.projects, key: "nav.projects" },
    { label: vi ? "Hồ sơ năng lực" : "Company profile", href: paths.profile, key: "nav.profile" },
    { label: vi ? "Tin tức" : "News", href: paths.news, key: "nav.news" },
    { label: vi ? "Tuyển dụng" : "Careers", href: paths.careers, key: "nav.careers" },
    { label: vi ? "Liên hệ" : "Contact", href: paths.contact, key: "nav.contact" },
  ];

  const socials = [
    { label: "Facebook", href: site.social.facebook },
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "YouTube", href: site.social.youtube },
    { label: "Zalo", href: site.social.zalo },
  ].filter((social) => social.href);

  return (
    <footer className="flex flex-col bg-sky-2 text-ink lg:min-h-[72svh]">
      <div className="wrap grid gap-x-8 gap-y-12 pt-16 pb-20 sm:grid-cols-2 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-4">
          <p className="font-display text-[1rem] text-ink">
            <Editable k="footer.offices" locale={locale} fallback={vi ? "Văn phòng" : "Offices"} as="span" />
          </p>
          <div className="mt-5 space-y-6">
            {site.offices.map((office) => (
              <a
                key={office.id}
                href={office.mapUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block text-[1rem] leading-relaxed text-ink-soft transition-colors hover:text-ink"
              >
                <span className="block text-ink">{office.name[locale]}</span>
                {office.address[locale]}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="font-display text-[1rem] text-ink">
            <Editable
              k="footer.navigation"
              locale={locale}
              fallback={vi ? "Điều hướng" : "Navigation"}
              as="span"
            />
          </p>
          <ul className="mt-5 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="text-[1rem] text-ink-soft transition-colors hover:text-ink"
                >
                  <Editable k={item.key} locale={locale} fallback={item.label} as="span" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="font-display text-[1rem] text-ink">
            <Editable k="footer.contact" locale={locale} fallback={vi ? "Liên hệ" : "Contact"} as="span" />
          </p>
          <ul className="mt-5 space-y-2.5 text-[1rem] text-ink-soft">
            <li>
              <a href={`tel:${site.contact.hotline}`} className="num transition-colors hover:text-ink">
                {site.contact.hotlineDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:${site.contact.phone}`} className="num transition-colors hover:text-ink">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="break-all transition-colors hover:text-ink"
              >
                {site.contact.email}
              </a>
            </li>
            {site.contact.workingHours ? (
              <li className="text-muted">{site.contact.workingHours}</li>
            ) : null}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="font-display text-[1rem] text-ink">
            <Editable k="footer.follow" locale={locale} fallback={vi ? "Kết nối" : "Follow"} as="span" />
          </p>
          <ul className="mt-5 space-y-2.5">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[1rem] text-ink-soft transition-colors hover:text-ink"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hidden flex-1 lg:block" aria-hidden />

      <div className="wrap pb-8">
        <p className="wordmark select-none text-brand" aria-hidden>
          FANSIPAN
        </p>
        <div className="mt-8 flex flex-col gap-3 text-[0.8125rem] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            © {year} {site.company.legalName[locale]} · {vi ? "MST" : "Tax code"}:{" "}
            {site.company.taxCode || (vi ? "Đang cập nhật" : "Updating")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="/image-credits.html" className="transition-colors hover:text-ink">
              <Editable
                k="footer.imageCredits"
                locale={locale}
                fallback={vi ? "Nguồn ảnh" : "Image credits"}
                as="span"
              />
            </a>
            <Link
              href={`/${locale}${paths.privacy}`}
              className="transition-colors hover:text-ink"
            >
              <Editable
                k="footer.privacy"
                locale={locale}
                fallback={vi ? "Chính sách bảo mật" : "Privacy policy"}
                as="span"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
