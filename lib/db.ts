import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Binary, MongoClient, type Collection, type Db } from "mongodb";
import type {
  AnalyticsDay,
  Application,
  Article,
  Banner,
  CapabilityDoc,
  Job,
  Locale,
  Partner,
  Project,
  Service,
  SiteData,
  Submission,
} from "./types";

export interface SiteSettingsDoc extends SiteData {
  _id: string;
}

export interface ContentOverrideDoc {
  key: string;
  vi?: string;
  en?: string;
  updatedAt: string;
}

export interface AdminUserDoc {
  username: string;
  role: "admin";
  passwordHash: string;
  updatedAt: string;
}

export interface StoredFileDoc {
  id: string;
  folder: string;
  filename: string;
  contentType: string;
  size: number;
  data: Binary;
  createdAt: string;
}

export interface AnalyticsDayDoc extends AnalyticsDay {
  updatedAt?: string;
}

declare global {
  var __fsgMongoPromise: Promise<MongoClient> | undefined;
  var __fsgDbInitPromise: Promise<void> | undefined;
}

const DEFAULT_URI = "mongodb://127.0.0.1:27017/fansipan_group";

function mongoUri() {
  return process.env.MONGODB_URI || DEFAULT_URI;
}

function mongoDbName() {
  if (process.env.MONGODB_DB) return process.env.MONGODB_DB;
  try {
    const parsed = new URL(mongoUri());
    const dbFromPath = parsed.pathname.replace(/^\//, "").trim();
    if (dbFromPath) return dbFromPath;
  } catch {
    // Fallback to default database name.
  }
  return "fansipan_group";
}

function getClient(): Promise<MongoClient> {
  if (!globalThis.__fsgMongoPromise) {
    const client = new MongoClient(mongoUri(), {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 8000,
    });
    globalThis.__fsgMongoPromise = client.connect().catch((err) => {
      globalThis.__fsgMongoPromise = undefined;
      throw err;
    });
  }
  return globalThis.__fsgMongoPromise;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const target = Buffer.from(expected, "hex");
  if (derived.length !== target.length) return false;
  return crypto.timingSafeEqual(derived, target);
}

async function readSeedJson<T>(fileName: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", fileName), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function ensureIndexesAndSeed(db: Db) {
  await Promise.all([
    db.collection("services").createIndex({ id: 1 }, { unique: true }),
    db.collection("projects").createIndex({ id: 1 }, { unique: true }),
    db.collection("projects").createIndex({ allowPublic: 1, featured: -1 }),
    db.collection("articles").createIndex({ slug: 1 }, { unique: true }),
    db.collection("articles").createIndex({ published: 1, date: -1 }),
    db.collection("jobs").createIndex({ slug: 1 }, { unique: true }),
    db.collection("banners").createIndex({ id: 1 }, { unique: true }),
    db.collection("banners").createIndex({ visible: 1, order: 1 }),
    db.collection("partners").createIndex({ id: 1 }, { unique: true }),
    db.collection("partners").createIndex({ visible: 1, order: 1 }),
    db.collection("capabilities").createIndex({ id: 1 }, { unique: true }),
    db.collection("capabilities").createIndex({ visible: 1, order: 1 }),
    db.collection("submissions").createIndex({ id: 1 }, { unique: true }),
    db.collection("submissions").createIndex({ createdAt: -1 }),
    db.collection("applications").createIndex({ id: 1 }, { unique: true }),
    db.collection("applications").createIndex({ createdAt: -1 }),
    db.collection("content_overrides").createIndex({ key: 1 }, { unique: true }),
    db.collection("analytics_days").createIndex({ date: 1 }, { unique: true }),
    db.collection("uploads").createIndex({ id: 1 }, { unique: true }),
    db.collection("admins").createIndex({ username: 1 }, { unique: true }),
  ]);

  // Idempotent seed from data/*.json only when collections are empty.
  const siteCol = db.collection<SiteSettingsDoc>("site_settings");
  if ((await siteCol.countDocuments({ _id: "main" })) === 0) {
    const site = await readSeedJson<SiteData>("site.json");
    if (site) {
      await siteCol.updateOne({ _id: "main" }, { $setOnInsert: { ...site, _id: "main" } }, { upsert: true });
    }
  }

  const seedArrayCollection = async <T extends object>(name: string, fileName: string) => {
    const col = db.collection<T>(name);
    if ((await col.estimatedDocumentCount()) === 0) {
      const items = await readSeedJson<T[]>(fileName);
      if (items && items.length > 0) {
        await col.insertMany(items as never[], { ordered: false }).catch(() => undefined);
      }
    }
  };

  await Promise.all([
    seedArrayCollection<Service>("services", "services.json"),
    seedArrayCollection<Project>("projects", "projects.json"),
    seedArrayCollection<Article>("articles", "news.json"),
    seedArrayCollection<Job>("jobs", "jobs.json"),
    seedArrayCollection<Banner>("banners", "banners.json"),
    seedArrayCollection<Partner>("partners", "partners.json"),
    seedArrayCollection<CapabilityDoc>("capabilities", "capabilities.json"),
    seedArrayCollection<Submission>("submissions", "submissions.json"),
    seedArrayCollection<Application>("applications", "applications.json"),
  ]);

  const overridesCol = db.collection<ContentOverrideDoc>("content_overrides");
  if ((await overridesCol.estimatedDocumentCount()) === 0) {
    const content = await readSeedJson<{ entries?: Record<string, Partial<Record<Locale, string>>> }>(
      "content.json",
    );
    const entries = content?.entries ?? {};
    const docs: ContentOverrideDoc[] = Object.entries(entries).map(([key, val]) => ({
      key,
      vi: val.vi,
      en: val.en,
      updatedAt: new Date().toISOString(),
    }));
    if (docs.length > 0) {
      await overridesCol.insertMany(docs, { ordered: false }).catch(() => undefined);
    }
  }

  const analyticsCol = db.collection<AnalyticsDayDoc>("analytics_days");
  if ((await analyticsCol.estimatedDocumentCount()) === 0) {
    const analytics = await readSeedJson<{ days?: Record<string, AnalyticsDay> }>("analytics.json");
    const docs = Object.values(analytics?.days ?? {});
    if (docs.length > 0) {
      await analyticsCol.insertMany(docs, { ordered: false }).catch(() => undefined);
    }
  }

  // Ensure single role "admin" exists in MongoDB.
  const adminsCol = db.collection<AdminUserDoc>("admins");
  if ((await adminsCol.countDocuments({ username: "admin" })) === 0) {
    const initialPassword =
      process.env.ADMIN_PASSWORD ||
      (process.env.NODE_ENV === "production" ? "" : "fansipan2026");
    if (initialPassword) {
      await adminsCol.updateOne(
        { username: "admin" },
        {
          $setOnInsert: {
            username: "admin",
            role: "admin",
            passwordHash: hashPassword(initialPassword),
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      );
    }
  }
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db(mongoDbName());
  if (!globalThis.__fsgDbInitPromise) {
    globalThis.__fsgDbInitPromise = ensureIndexesAndSeed(db).catch((err) => {
      globalThis.__fsgDbInitPromise = undefined;
      throw err;
    });
  }
  await globalThis.__fsgDbInitPromise;
  return db;
}

export async function collections() {
  const db = await getDb();
  return {
    site: db.collection<SiteSettingsDoc>("site_settings"),
    services: db.collection<Service>("services"),
    projects: db.collection<Project>("projects"),
    articles: db.collection<Article>("articles"),
    jobs: db.collection<Job>("jobs"),
    banners: db.collection<Banner>("banners"),
    partners: db.collection<Partner>("partners"),
    capabilities: db.collection<CapabilityDoc>("capabilities"),
    submissions: db.collection<Submission>("submissions"),
    applications: db.collection<Application>("applications"),
    contentOverrides: db.collection<ContentOverrideDoc>("content_overrides"),
    analyticsDays: db.collection<AnalyticsDayDoc>("analytics_days"),
    uploads: db.collection<StoredFileDoc>("uploads"),
    admins: db.collection<AdminUserDoc>("admins"),
  } as const;
}

export type CollectionMap = Awaited<ReturnType<typeof collections>>;
export type { Collection };

