"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Close, Menu } from "@/components/ui/icons";
import { Logo } from "@/components/brand/logo";
import { EditableText } from "@/components/editor/editable-text";
import { cn } from "@/lib/utils";
import { paths, switchLocalePath, ui, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function Header({
  locale,
  site,
}: {
  locale: Locale;
  site: SiteData;
}) {
  const pathname = usePathname();
  const t = ui[locale];
  const [menu, setMenu] = useState(false);

  const home = `/${locale}`;
  const onPhoto = pathname === home || pathname === `${home}/`;

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isActive = (path: string) => {
    const full = `/${locale}${path}`;
    if (!path) return pathname === home || pathname === `${home}/`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  const links = [
    { label: t.nav.services, path: paths.services, key: "nav.services" },
    { label: t.nav.projects, path: paths.projects, key: "nav.projects" },
    { label: t.nav.about, path: paths.about, key: "nav.about" },
    { label: t.nav.news, path: paths.news, key: "nav.news" },
  ];

  const drawerLinks = [
    { label: t.nav.services, path: paths.services, key: "nav.services" },
    { label: t.nav.projects, path: paths.projects, key: "nav.projects" },
    { label: t.nav.profile, path: paths.profile, key: "nav.profile" },
    { label: t.nav.news, path: paths.news, key: "nav.news" },
    { label: t.nav.careers, path: paths.careers, key: "nav.careers" },
    { label: t.nav.about, path: paths.about, key: "nav.about" },
    { label: t.nav.contact, path: paths.contact, key: "nav.contact" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="wrap flex h-24 items-center justify-between gap-6">
        <Link
          href={home}
          aria-label={site.company.displayName}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo size="md" variant={onPhoto ? "light" : "dark"} />
        </Link>

        <nav
          aria-label={t.labels.menu}
          className={cn(
            "hidden items-center gap-8 lg:flex",
            onPhoto ? "text-white" : "text-ink",
          )}
        >
          {links.map((item) => (
            <Link
              key={item.path}
              href={`/${locale}${item.path}`}
              className={cn(
                "text-[1rem] transition-opacity hover:opacity-60",
                isActive(item.path) && "underline decoration-1 underline-offset-[6px]",
              )}
            >
              <EditableText k={item.key} defaultText={item.label} as="span" />
            </Link>
          ))}

          <span aria-hidden className={cn("h-4 w-px", onPhoto ? "bg-white/30" : "bg-line")} />

          <div className="flex items-center gap-2 text-[0.8125rem]">
            {(["vi", "en"] as const).map((code) => (
              <Link
                key={code}
                href={switchLocalePath(pathname, code)}
                hrefLang={code}
                className={cn(
                  "uppercase transition-opacity hover:opacity-60",
                  locale === code
                    ? "underline decoration-1 underline-offset-[5px]"
                    : "opacity-55",
                )}
                aria-current={locale === code ? "true" : undefined}
              >
                {code}
              </Link>
            ))}
          </div>

          <Link
            href={`/${locale}${paths.contact}#quote`}
            className="btn btn-primary btn-sm"
          >
            <EditableText k="nav.quote" defaultText={t.actions.quote} as="span" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenu(true)}
          aria-label={t.labels.menu}
          aria-expanded={menu}
          className={cn(
            "inline-flex size-11 items-center justify-center lg:hidden",
            onPhoto ? "text-white" : "text-ink",
          )}
        >
          <Menu className="size-6" strokeWidth={1.6} />
        </button>
      </div>

      {menu ? (
        <div className="fixed inset-0 z-[70] flex flex-col bg-navy text-white">
          <div className="wrap flex h-24 shrink-0 items-center justify-between">
            <Link href={home} aria-label={site.company.displayName}>
              <Logo size="md" variant="light" />
            </Link>
            <button
              type="button"
              onClick={() => setMenu(false)}
              aria-label={t.actions.close}
              className="inline-flex size-11 items-center justify-center text-white"
            >
              <Close className="size-6" strokeWidth={1.6} />
            </button>
          </div>

          <nav
            aria-label={t.labels.menu}
            className="wrap flex flex-1 flex-col justify-center gap-2 overflow-y-auto py-8"
          >
            {drawerLinks.map((item) => (
              <Link
                key={item.path}
                href={`/${locale}${item.path}`}
                className="display-2 w-fit text-white transition-colors hover:text-accent"
              >
                <EditableText k={item.key} defaultText={item.label} as="span" />
              </Link>
            ))}
          </nav>

          <div className="wrap flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[1rem] text-white/70">
              <a href={`tel:${site.contact.hotline}`} className="num hover:text-white">
                {site.contact.hotlineDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-[0.8125rem]">
              {(["vi", "en"] as const).map((code) => (
                <Link
                  key={code}
                  href={switchLocalePath(pathname, code)}
                  hrefLang={code}
                  className={cn(
                    "uppercase",
                    locale === code
                      ? "underline decoration-1 underline-offset-[5px]"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  {code}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
