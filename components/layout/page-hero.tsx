import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function PageHero({
  title,
  intro,
  introClassName,
  titleClassName,
  breadcrumb,
  children,
  tone = "light",
}: {
  locale: Locale;
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  introClassName?: string;
  titleClassName?: string;
  breadcrumb: { label: string; href?: string }[];
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section className={cn(dark ? "bg-navy text-white" : "bg-white text-ink")}>
      <div className="wrap pt-36 pb-12 lg:pt-44 lg:pb-16">
        <nav aria-label="Breadcrumb">
          <ol
            className={cn(
              "flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem]",
              dark ? "text-white/70" : "text-muted",
            )}
          >
            {breadcrumb.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors",
                      dark ? "hover:text-white" : "hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={dark ? "text-white/85" : "text-ink"} aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className={cn("display-1 mt-10 max-w-5xl", titleClassName)}>{title}</h1>

        {intro ? (
          <p className={cn("lead mt-7 max-w-2xl", dark && "text-white/70", introClassName)}>
            {intro}
          </p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
