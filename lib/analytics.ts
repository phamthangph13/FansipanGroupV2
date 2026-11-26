import "server-only";
import crypto from "crypto";
import { collections } from "./db";
import type { AnalyticsDay, AnalyticsSummary } from "./types";

const MAX_DAYS = 120;
const MAX_VISITORS_PER_DAY = 8000;

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function encodeMapKey(raw: string) {
  return raw.replace(/%/g, "%25").replace(/\./g, "%2E").replace(/\$/g, "%24");
}

function decodeMapKey(encoded: string) {
  return encoded.replace(/%24/g, "$").replace(/%2E/g, ".").replace(/%25/g, "%");
}

function decodeMap(source: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!source) return out;
  for (const [key, val] of Object.entries(source)) {
    out[decodeMapKey(key)] = (out[decodeMapKey(key)] ?? 0) + val;
  }
  return out;
}

function normalizePath(value: string) {
  let next = value.split("?")[0].split("#")[0].trim();
  if (!next.startsWith("/")) next = `/${next}`;
  return next.slice(0, 220);
}

function normalizeReferrer(value: string) {
  if (!value) return "direct";
  try {
    const url = new URL(value);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return "internal";
    return url.hostname.replace(/^www\./, "").slice(0, 120);
  } catch {
    return "direct";
  }
}

function deviceFor(width: number) {
  if (!Number.isFinite(width) || width <= 0) return "unknown";
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export async function recordView(input: {
  path: string;
  locale: string;
  referrer: string;
  width: number;
  userAgent: string;
  ip: string;
}) {
  const { analyticsDays } = await collections();
  const date = dayKey();
  const visitor = crypto
    .createHash("sha256")
    .update(
      `${input.ip}|${input.userAgent}|${date}|${process.env.ANALYTICS_SALT ?? "fansipan-group"}`,
    )
    .digest("hex")
    .slice(0, 24);

  const pageKey = encodeMapKey(normalizePath(input.path));
  const refKey = encodeMapKey(normalizeReferrer(input.referrer));
  const deviceKey = encodeMapKey(deviceFor(input.width));
  const localeKey = input.locale === "en" ? "en" : "vi";

  const existing = await analyticsDays.findOne({ date }, { projection: { visitors: 1 } });
  const canAddVisitor = !existing || (existing.visitors?.length ?? 0) < MAX_VISITORS_PER_DAY;

  await analyticsDays.updateOne(
    { date },
    {
      $setOnInsert: { date },
      $set: { updatedAt: new Date().toISOString() },
      $inc: {
        views: 1,
        [`pages.${pageKey}`]: 1,
        [`referrers.${refKey}`]: 1,
        [`devices.${deviceKey}`]: 1,
        [`locales.${localeKey}`]: 1,
      },
      ...(canAddVisitor ? { $addToSet: { visitors: visitor } } : {}),
    },
    { upsert: true },
  );

  // Prune records older than retention window occasionally (~1% of writes).
  if (Math.random() < 0.02) {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - MAX_DAYS);
    await analyticsDays.deleteMany({ date: { $lt: dayKey(cutoff) } });
  }
}

function sumMap(target: Record<string, number>, source: Record<string, number>) {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function top(map: Record<string, number>, limit: number) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value }));
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { analyticsDays } = await collections();
  const rawDays = await analyticsDays
    .find({}, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .limit(MAX_DAYS)
    .toArray();

  const days: AnalyticsDay[] = rawDays.map((doc) => ({
    date: doc.date,
    views: doc.views ?? 0,
    visitors: doc.visitors ?? [],
    pages: decodeMap(doc.pages),
    referrers: decodeMap(doc.referrers),
    devices: decodeMap(doc.devices),
    locales: decodeMap(doc.locales),
  }));

  const today = dayKey();
  const last30 = days.slice(0, 30);
  const last7 = days.slice(0, 7);

  const pages: Record<string, number> = {};
  const referrers: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const locales: Record<string, number> = {};
  const allVisitors = new Set<string>();
  let totalViews = 0;

  for (const day of days) {
    totalViews += day.views;
    for (const visitor of day.visitors) allVisitors.add(visitor);
    sumMap(pages, day.pages);
    sumMap(referrers, day.referrers);
    sumMap(devices, day.devices);
    sumMap(locales, day.locales);
  }

  const todayData = days.find((d) => d.date === today);

  return {
    totalViews,
    totalVisitors: allVisitors.size,
    todayViews: todayData?.views ?? 0,
    todayVisitors: todayData?.visitors.length ?? 0,
    last7Views: last7.reduce((sum, day) => sum + day.views, 0),
    last30Views: last30.reduce((sum, day) => sum + day.views, 0),
    days: [...last30].reverse(),
    topPages: top(pages, 12).map(({ key, value }) => ({ path: key, views: value })),
    topReferrers: top(referrers, 8).map(({ key, value }) => ({ source: key, views: value })),
    devices: top(devices, 4).map(({ key, value }) => ({ device: key, views: value })),
    locales: top(locales, 2).map(({ key, value }) => ({ locale: key, views: value })),
  };
}

export function formatAnalyticsDay(day: AnalyticsDay) {
  return {
    date: day.date,
    views: day.views,
    visitors: day.visitors.length,
  };
}
