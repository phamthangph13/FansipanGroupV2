import Link from "next/link";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function Footer({ locale, site }: { locale: Locale; site: SiteData }) {
  const year = new Date().getFullYear();
  const vi = locale === "vi";

  const nav = [
    { label: vi ? "Giới thiệu" : "About", href: paths.about },
    { label: vi ? "Dịch vụ" : "Services", href: paths.services },
    { label: vi ? "Dự án" : "Projects", href: paths.projects },
    { label: vi ? "Hồ sơ năng lực" : "Company profile", href: paths.profile },
    { label: vi ? "Tin tức" : "News", href: paths.news },
    { label: vi ? "Tuyển dụng" : "Careers", href: paths.careers },
    { label: vi ? "Liên hệ" : "Contact", href: paths.contact },
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
          <p className="font-display text-[1rem] text-ink">{vi ? "Văn phòng" : "Offices"}</p>
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
            {vi ? "Điều hướng" : "Navigation"}
          </p>
          <ul className="mt-5 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="text-[1rem] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="font-display text-[1rem] text-ink">{vi ? "Liên hệ" : "Contact"}</p>
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
          <p className="font-display text-[1rem] text-ink">{vi ? "Kết nối" : "Follow"}</p>
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
              {vi ? "Nguồn ảnh" : "Image credits"}
            </a>
            <Link
              href={`/${locale}${paths.privacy}`}
              className="transition-colors hover:text-ink"
            >
              {vi ? "Chính sách bảo mật" : "Privacy policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
