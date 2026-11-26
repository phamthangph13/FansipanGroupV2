import "server-only";
import { cache } from "react";
import { collections } from "./db";
import type {
  Application,
  Article,
  Banner,
  CapabilityDoc,
  ContentStore,
  ContentValue,
  Job,
  Locale,
  Partner,
  Project,
  Service,
  SiteData,
  Submission,
} from "./types";

function stripMongoId<T extends object>(doc: T & { _id?: unknown }): T {
  const { _id: _, ...rest } = doc;
  return rest as T;
}

/* -------------------------------------------------------------------- Reads */

export const getSite = cache(async (): Promise<SiteData> => {
  const { site } = await collections();
  const doc = await site.findOne({ _id: "main" });
  if (!doc) {
    throw new Error("Site settings not found in MongoDB.");
  }
  return stripMongoId(doc);
});

export async function getSiteUncached(): Promise<SiteData> {
  const { site } = await collections();
  const doc = await site.findOne({ _id: "main" });
  if (!doc) throw new Error("Site settings not found in MongoDB.");
  return stripMongoId(doc);
}

export const getServices = cache(async (): Promise<Service[]> => {
  const { services } = await collections();
  const docs = await services.find({}, { projection: { _id: 0 } }).sort({ code: 1 }).toArray();
  return docs;
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const { projects } = await collections();
  return projects.find({}, { projection: { _id: 0 } }).toArray();
});

export async function getProjectsUncached(): Promise<Project[]> {
  const { projects } = await collections();
  return projects.find({}, { projection: { _id: 0 } }).toArray();
}

export const getBanners = cache(async (): Promise<Banner[]> => {
  const { banners } = await collections();
  return banners.find({ visible: true }, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
});

export const getAllBanners = cache(async (): Promise<Banner[]> => {
  const { banners } = await collections();
  return banners.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  const { partners } = await collections();
  return partners.find({ visible: true }, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
});

export const getAllPartners = cache(async (): Promise<Partner[]> => {
  const { partners } = await collections();
  return partners.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
});

export const getCapabilityDocs = cache(async (): Promise<CapabilityDoc[]> => {
  const { capabilities } = await collections();
  return capabilities
    .find({ visible: true }, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();
});

export const getAllCapabilityDocs = cache(async (): Promise<CapabilityDoc[]> => {
  const { capabilities } = await collections();
  return capabilities.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
});

export async function getContentStoreUncached(): Promise<ContentStore> {
  const { contentOverrides } = await collections();
  const docs = await contentOverrides.find({}, { projection: { _id: 0 } }).toArray();
  const entries: Record<string, ContentValue> = {};
  let updatedAt = "";
  for (const doc of docs) {
    const val: ContentValue = {};
    if (typeof doc.vi === "string" && doc.vi.length > 0) val.vi = doc.vi;
    if (typeof doc.en === "string" && doc.en.length > 0) val.en = doc.en;
    if (val.vi !== undefined || val.en !== undefined) {
      entries[doc.key] = val;
    }
    if (doc.updatedAt && doc.updatedAt > updatedAt) updatedAt = doc.updatedAt;
  }
  return { version: 1, updatedAt, entries };
}

export const getContentStore = cache(async (): Promise<ContentStore> => {
  return getContentStoreUncached();
});

export const getArticles = cache(async (): Promise<Article[]> => {
  const { articles } = await collections();
  return articles
    .find({ published: true }, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .toArray();
});

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const { articles } = await collections();
  return articles.find({}, { projection: { _id: 0 } }).sort({ date: -1 }).toArray();
});

export const getJobs = cache(async (): Promise<Job[]> => {
  const { jobs } = await collections();
  return jobs.find({}, { projection: { _id: 0 } }).toArray();
});

export const getSubmissions = cache(async (): Promise<Submission[]> => {
  const { submissions } = await collections();
  return submissions.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
});

export const getApplications = cache(async (): Promise<Application[]> => {
  const { applications } = await collections();
  return applications.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
});

export async function getArticle(slug: string): Promise<Article | undefined> {
  const { articles } = await collections();
  const doc = await articles.findOne({ slug, published: true }, { projection: { _id: 0 } });
  return doc ?? undefined;
}

export async function getJob(slug: string): Promise<Job | undefined> {
  const { jobs } = await collections();
  const doc = await jobs.findOne({ slug }, { projection: { _id: 0 } });
  return doc ?? undefined;
}

export async function getService(slug: string): Promise<Service | undefined> {
  const { services } = await collections();
  const doc = await services.findOne({ slug }, { projection: { _id: 0 } });
  return doc ?? undefined;
}

/** Projects that are allowed to be shown on the public website. */
export async function getPublicProjects(): Promise<Project[]> {
  const { projects } = await collections();
  return projects
    .find({ allowPublic: { $ne: false } }, { projection: { _id: 0 } })
    .toArray();
}

export async function getProject(id: string): Promise<Project | undefined> {
  const { projects } = await collections();
  const doc = await projects.findOne({ id }, { projection: { _id: 0 } });
  return doc ?? undefined;
}

export async function getPublicProject(id: string): Promise<Project | undefined> {
  const { projects } = await collections();
  const doc = await projects.findOne(
    { id, allowPublic: { $ne: false } },
    { projection: { _id: 0 } },
  );
  return doc ?? undefined;
}

/** Resolve a content override for one key and locale, with a fallback. */
export function contentValue(
  store: ContentStore,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  const entry = store.entries[key];
  if (!entry) return fallback;
  const value = entry[locale];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

/* ---------------------------------------------------------------- Mutations */

export async function saveSiteData(data: SiteData): Promise<void> {
  const { site } = await collections();
  await site.updateOne({ _id: "main" }, { $set: data }, { upsert: true });
}

export async function upsertProject(project: Project, originalId?: string): Promise<void> {
  const { projects } = await collections();
  if (originalId && originalId !== project.id) {
    await projects.deleteOne({ id: originalId });
  }
  await projects.replaceOne({ id: project.id }, project, { upsert: true });
}

export async function deleteProjectById(id: string): Promise<void> {
  const { projects } = await collections();
  await projects.deleteOne({ id });
}

export async function upsertArticle(article: Article, originalSlug?: string): Promise<void> {
  const { articles } = await collections();
  if (originalSlug && originalSlug !== article.slug) {
    await articles.deleteOne({ slug: originalSlug });
  }
  await articles.replaceOne({ slug: article.slug }, article, { upsert: true });
}

export async function deleteArticleBySlug(slug: string): Promise<void> {
  const { articles } = await collections();
  await articles.deleteOne({ slug });
}

export async function upsertJob(job: Job, originalSlug?: string): Promise<void> {
  const { jobs } = await collections();
  if (originalSlug && originalSlug !== job.slug) {
    await jobs.deleteOne({ slug: originalSlug });
  }
  await jobs.replaceOne({ slug: job.slug }, job, { upsert: true });
}

export async function deleteJobBySlug(slug: string): Promise<void> {
  const { jobs } = await collections();
  await jobs.deleteOne({ slug });
}

export async function upsertBanner(banner: Banner, originalId?: string): Promise<void> {
  const { banners } = await collections();
  if (originalId && originalId !== banner.id) {
    await banners.deleteOne({ id: originalId });
  }
  await banners.replaceOne({ id: banner.id }, banner, { upsert: true });
}

export async function deleteBannerById(id: string): Promise<void> {
  const { banners } = await collections();
  await banners.deleteOne({ id });
}

export async function upsertPartner(partner: Partner, originalId?: string): Promise<void> {
  const { partners } = await collections();
  if (originalId && originalId !== partner.id) {
    await partners.deleteOne({ id: originalId });
  }
  await partners.replaceOne({ id: partner.id }, partner, { upsert: true });
}

export async function deletePartnerById(id: string): Promise<void> {
  const { partners } = await collections();
  await partners.deleteOne({ id });
}

export async function upsertCapabilityDoc(
  doc: CapabilityDoc,
  originalId?: string,
): Promise<void> {
  const { capabilities } = await collections();
  if (originalId && originalId !== doc.id) {
    await capabilities.deleteOne({ id: originalId });
  }
  await capabilities.replaceOne({ id: doc.id }, doc, { upsert: true });
}

export async function deleteCapabilityDocById(id: string): Promise<void> {
  const { capabilities } = await collections();
  await capabilities.deleteOne({ id });
}

export async function setContentOverride(
  key: string,
  locale: Locale,
  value: string,
): Promise<void> {
  const { contentOverrides } = await collections();
  await contentOverrides.updateOne(
    { key },
    {
      $set: {
        key,
        [locale]: value,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
}

export async function setContentOverrideBoth(
  key: string,
  values: { vi?: string; en?: string },
): Promise<void> {
  const { contentOverrides } = await collections();
  const vi = values.vi?.trim() ?? "";
  const en = values.en?.trim() ?? "";
  if (!vi && !en) {
    await contentOverrides.deleteOne({ key });
    return;
  }
  await contentOverrides.updateOne(
    { key },
    {
      $set: {
        key,
        ...(vi ? { vi } : {}),
        ...(en ? { en } : {}),
        updatedAt: new Date().toISOString(),
      },
      ...(vi ? {} : { $unset: { vi: "" } }),
      ...(en ? {} : { $unset: { en: "" } }),
    },
    { upsert: true },
  );
}

export async function deleteContentOverride(key: string): Promise<void> {
  const { contentOverrides } = await collections();
  await contentOverrides.deleteOne({ key });
}

export async function resetAllContentOverrides(): Promise<void> {
  const { contentOverrides } = await collections();
  await contentOverrides.deleteMany({});
}

export async function insertSubmission(submission: Submission): Promise<void> {
  const { submissions } = await collections();
  await submissions.insertOne(submission);
}

export async function toggleSubmissionReadById(id: string): Promise<void> {
  const { submissions } = await collections();
  const doc = await submissions.findOne({ id });
  if (!doc) return;
  await submissions.updateOne({ id }, { $set: { read: !doc.read } });
}

export async function markAllSubmissionsAsRead(): Promise<void> {
  const { submissions } = await collections();
  await submissions.updateMany({ read: false }, { $set: { read: true } });
}

export async function deleteSubmissionById(id: string): Promise<void> {
  const { submissions } = await collections();
  await submissions.deleteOne({ id });
}

export async function insertApplication(application: Application): Promise<void> {
  const { applications } = await collections();
  await applications.insertOne(application);
}

export async function toggleApplicationReadById(id: string): Promise<void> {
  const { applications } = await collections();
  const doc = await applications.findOne({ id });
  if (!doc) return;
  await applications.updateOne({ id }, { $set: { read: !doc.read } });
}

export async function markAllApplicationsAsRead(): Promise<void> {
  const { applications } = await collections();
  await applications.updateMany({ read: false }, { $set: { read: true } });
}

export async function deleteApplicationById(id: string): Promise<Application | null> {
  const { applications } = await collections();
  const doc = await applications.findOne({ id }, { projection: { _id: 0 } });
  if (doc) await applications.deleteOne({ id });
  return doc;
}
