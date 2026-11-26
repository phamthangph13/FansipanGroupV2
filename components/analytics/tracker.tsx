"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sends one lightweight page-view per session per path. No cookies, no
 * personal data; the API only stores a daily hash for unique counts.
 */
export function AnalyticsTracker({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const key = `fsg-view:${pathname}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Private mode: still send the view.
    }

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: document.referrer,
      width: window.innerWidth,
      language: navigator.language,
    });

    const body = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  }, [pathname, locale]);

  return null;
}
