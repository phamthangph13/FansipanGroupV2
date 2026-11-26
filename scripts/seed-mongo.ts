import { existsSync, readFileSync } from "fs";
import path from "path";
import { collections, getDb } from "../lib/db";

// Load .env.local if present when invoked via tsx outside Next.js.
const envFile = path.join(process.cwd(), ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

async function main() {
  const db = await getDb();
  const cols = await collections();
  const counts = await Promise.all([
    cols.site.countDocuments(),
    cols.services.countDocuments(),
    cols.projects.countDocuments(),
    cols.articles.countDocuments(),
    cols.jobs.countDocuments(),
    cols.banners.countDocuments(),
    cols.partners.countDocuments(),
    cols.capabilities.countDocuments(),
    cols.submissions.countDocuments(),
    cols.applications.countDocuments(),
    cols.contentOverrides.countDocuments(),
    cols.analyticsDays.countDocuments(),
    cols.admins.countDocuments(),
  ]);

  console.log(`Connected to MongoDB database: ${db.databaseName}`);
  console.log({
    site_settings: counts[0],
    services: counts[1],
    projects: counts[2],
    articles: counts[3],
    jobs: counts[4],
    banners: counts[5],
    partners: counts[6],
    capabilities: counts[7],
    submissions: counts[8],
    applications: counts[9],
    content_overrides: counts[10],
    analytics_days: counts[11],
    admins: counts[12],
  });
  process.exit(0);
}

main().catch((err) => {
  console.error("MongoDB seed failed:", err);
  process.exit(1);
});