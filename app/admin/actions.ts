"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminLoginPath } from "@/lib/admin-path";
import {
  checkPassword,
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
  updateAdminPassword,
} from "@/lib/auth";
import {
  deleteApplicationById,
  deleteArticleBySlug,
  deleteBannerById,
  deleteCapabilityDocById,
  deleteContentOverride,
  deleteJobBySlug,
  deletePartnerById,
  deleteProjectById,
  deleteSubmissionById,
  getAllArticles,
  getAllBanners,
  getAllCapabilityDocs,
  getAllPartners,
  getJobs,
  getProjectsUncached,
  getSiteUncached,
  markAllApplicationsAsRead,
  markAllSubmissionsAsRead,
  resetAllContentOverrides,
  saveSiteData,
  setContentOverrideBoth,
  toggleApplicationReadById,
  toggleSubmissionReadById,
  upsertArticle,
  upsertBanner,
  upsertCapabilityDoc,
  upsertJob,
  upsertPartner,
  upsertProject,
} from "@/lib/content";
import { categorizeText, extractDocument, keywordTags } from "@/lib/import";
import { deleteCv, savePublicUpload } from "@/lib/storage";
import type {
  Article,
  ArticleCategory,
  Banner,
  CapabilityDoc,
  CapabilityKind,
  Job,
  Partner,
  Project,
  ProjectStatus,
  ServiceId,
  SiteData,
} from "@/lib/types";

/* ------------------------------------------------------------------ Helpers */

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function localized(formData: FormData, base: string) {
  return {
    vi: value(formData, `${base}Vi`),
    en: value(formData, `${base}En`),
  };
}

function checked(formData: FormData, key: string) {
  const raw = formData.get(key);
  return raw === "on" || raw === "true" || raw === "1";
}

function slugify(input: string) {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${Date.now().toString(36)}`;
}

function numberOrNull(formData: FormData, key: string) {
  const raw = value(formData, key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

const serviceIds: ServiceId[] = ["hvac", "me", "cooling", "maintenance"];
const projectStatuses: ProjectStatus[] = ["completed", "in_progress", "planned"];
const articleCategories: ArticleCategory[] = [
  "du-an",
  "dich-vu",
  "kien-thuc",
  "tin-tuc",
  "hoat-dong-noi-bo",
];

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* -------------------------------------------------------------------- Auth */

export async function loginAction(
  _previous: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const password = value(formData, "password");
  if (!password) return { error: "Vui lòng nhập mật khẩu." };
  if (!(await checkPassword(password))) {
    return { error: "Mật khẩu không đúng. Vui lòng thử lại." };
  }
  await setSessionCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect(adminLoginPath());
}

export async function changePasswordAction(formData: FormData) {
  await requireAdmin();
  const currentPassword = value(formData, "currentPassword");
  const newPassword = value(formData, "newPassword");
  const confirmPassword = value(formData, "confirmPassword");

  if (!currentPassword || !newPassword) {
    redirect("/admin/cai-dat?error=missing-password#bao-mat");
  }
  if (newPassword !== confirmPassword) {
    redirect("/admin/cai-dat?error=password-mismatch#bao-mat");
  }
  const result = await updateAdminPassword(currentPassword, newPassword);
  if (!result.ok) {
    redirect(`/admin/cai-dat?error=${result.error}#bao-mat`);
  }
  redirect("/admin/cai-dat?ok=password-updated#bao-mat");
}

/* ------------------------------------------------------------- Submissions */

export async function toggleSubmissionRead(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await toggleSubmissionReadById(id);
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
}

export async function markAllSubmissionsRead() {
  await requireAdmin();
  await markAllSubmissionsAsRead();
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
}

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await deleteSubmissionById(id);
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
  redirect("/admin/yeu-cau?ok=deleted");
}

/* -------------------------------------------------------------- Applications */

export async function toggleApplicationRead(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await toggleApplicationReadById(id);
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
}

export async function markAllApplicationsRead() {
  await requireAdmin();
  await markAllApplicationsAsRead();
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const deleted = await deleteApplicationById(id);
  if (deleted) await deleteCv(deleted.cvFile);
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
  redirect("/admin/ung-tuyen?ok=deleted");
}

/* ------------------------------------------------------------ Home sections */

export async function toggleHomeSection(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const site = await getSiteUncached();
  const next: SiteData = {
    ...site,
    homeSections: site.homeSections.map((section) =>
      section.id === id ? { ...section, enabled: !section.enabled } : section,
    ),
  };
  await saveSiteData(next);
  revalidatePath("/admin/trang-chu");
  refreshPublic();
}

export async function moveHomeSection(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const direction = value(formData, "direction");
  const site = await getSiteUncached();
  const sections = [...site.homeSections];
  const index = sections.findIndex((section) => section.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index >= 0 && target >= 0 && target < sections.length) {
    [sections[index], sections[target]] = [sections[target], sections[index]];
  }
  await saveSiteData({ ...site, homeSections: sections });
  revalidatePath("/admin/trang-chu");
  refreshPublic();
}

/* ------------------------------------------------------------------ Projects */

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const originalId = value(formData, "originalId");
  const name = value(formData, "name");
  const nameEn = value(formData, "nameEn") || name;
  if (!name) redirect("/admin/du-an?error=missing-name");

  const projects = await getProjectsUncached();
  let id = value(formData, "id") || slugify(nameEn || name);
  if (!originalId && projects.some((item) => item.id === id)) {
    id = `${id}-${Date.now().toString(36).slice(-4)}`;
  }

  const statusRaw = value(formData, "status") as ProjectStatus;
  const status = projectStatuses.includes(statusRaw) ? statusRaw : "completed";
  const categories = serviceIds.filter((serviceId) =>
    checked(formData, `category_${serviceId}`),
  );

  let image = value(formData, "image");
  const imageUpload = formData.get("imageFile");
  if (imageUpload instanceof File && imageUpload.size > 0) {
    const stored = await savePublicUpload(imageUpload, "projects", "image");
    if (!stored.ok) {
      redirect(`/admin/du-an/${originalId || "new"}?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    image = stored.url;
  }

  let clientLogo = value(formData, "clientLogo");
  const logoUpload = formData.get("clientLogoFile");
  if (logoUpload instanceof File && logoUpload.size > 0) {
    const stored = await savePublicUpload(logoUpload, "partners", "image");
    if (!stored.ok) {
      redirect(`/admin/du-an/${originalId || "new"}?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    clientLogo = stored.url;
  }

  const gallery = value(formData, "gallery")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);

  const galleryFiles = formData.getAll("galleryFiles");
  for (const entry of galleryFiles) {
    if (entry instanceof File && entry.size > 0 && gallery.length < 30) {
      const stored = await savePublicUpload(entry, "projects", "image");
      if (stored.ok) gallery.push(stored.url);
    }
  }

  const documents = value(formData, "documents")
    .split(/\r?\n/)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      const file = rest.join("|").trim();
      return title?.trim() && file ? { title: title.trim(), file } : null;
    })
    .filter((item): item is { title: string; file: string } => item !== null)
    .slice(0, 30);

  const docUpload = formData.get("documentFile");
  if (docUpload instanceof File && docUpload.size > 0 && documents.length < 30) {
    const stored = await savePublicUpload(docUpload, "documents", "document");
    if (stored.ok) {
      const docTitle = value(formData, "documentTitle") || docUpload.name.replace(/\.[^.]+$/, "");
      documents.push({ title: docTitle, file: stored.url });
    }
  }

  const project: Project = {
    id,
    name,
    nameEn,
    scope: localized(formData, "scope"),
    location: localized(formData, "location"),
    year: numberOrNull(formData, "year"),
    status,
    categories,
    featured: checked(formData, "featured"),
    allowPublic: checked(formData, "allowPublic"),
    image: image || null,
    clientLogo: clientLogo || null,
    body: localized(formData, "body"),
    gallery,
    documents,
    sector: localized(formData, "sector"),
    client: localized(formData, "client"),
    duration: localized(formData, "duration"),
  };

  await upsertProject(project, originalId || undefined);
  revalidatePath("/admin/du-an");
  refreshPublic();
  redirect("/admin/du-an?ok=saved");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await deleteProjectById(id);
  revalidatePath("/admin/du-an");
  refreshPublic();
  redirect("/admin/du-an?ok=deleted");
}

/* ---------------------------------------------------------------------- News */

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  const originalSlug = value(formData, "originalSlug");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/tin-tuc?error=missing-title");

  const articles = await getAllArticles();
  let slug = value(formData, "slug") || slugify(title.vi);
  if (!originalSlug && articles.some((item) => item.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const existing = originalSlug
    ? articles.find((item) => item.slug === originalSlug)
    : undefined;
  const categoryRaw = value(formData, "category") as ArticleCategory;
  const category = articleCategories.includes(categoryRaw) ? categoryRaw : "tin-tuc";
  const readingMinutes = Math.min(
    120,
    Math.max(1, Number(value(formData, "readingMinutes")) || 5),
  );
  const autoCategory = checked(formData, "autoCategory");
  const body = localized(formData, "body");
  const excerpt = localized(formData, "excerpt");

  let tags = value(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
  if (tags.length === 0) {
    tags = keywordTags(`${title.vi} ${body.vi}`, 5);
  }

  let image = value(formData, "image");
  const imageUpload = formData.get("imageFile");
  if (imageUpload instanceof File && imageUpload.size > 0) {
    const stored = await savePublicUpload(imageUpload, "news", "image");
    if (!stored.ok) {
      redirect(`/admin/tin-tuc/${originalSlug || "new"}?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    image = stored.url;
  }

  const article: Article = {
    slug,
    category: autoCategory ? categorizeText(title.vi, `${excerpt.vi} ${body.vi}`) : category,
    title: { vi: title.vi, en: title.en || title.vi },
    excerpt: { vi: excerpt.vi, en: excerpt.en || excerpt.vi },
    body: { vi: body.vi, en: body.en || body.vi },
    date: value(formData, "date") || new Date().toISOString().slice(0, 10),
    readingMinutes,
    published: checked(formData, "published"),
    image: image || null,
    autoCategory,
    sourceFile: value(formData, "sourceFile") || existing?.sourceFile || null,
    tags,
  };

  await upsertArticle(article, originalSlug || undefined);
  revalidatePath("/admin/tin-tuc");
  refreshPublic();
  redirect("/admin/tin-tuc?ok=saved");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const slug = value(formData, "slug");
  await deleteArticleBySlug(slug);
  revalidatePath("/admin/tin-tuc");
  refreshPublic();
  redirect("/admin/tin-tuc?ok=deleted");
}

/* ---------------------------------------------------------------------- Jobs */

export async function saveJob(formData: FormData) {
  await requireAdmin();
  const originalSlug = value(formData, "originalSlug");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/tuyen-dung?error=missing-title");

  const jobs = await getJobs();
  let slug = value(formData, "slug") || slugify(title.vi);
  if (!originalSlug && jobs.some((item) => item.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const deadline = value(formData, "deadline");
  const job: Job = {
    slug,
    title,
    department: localized(formData, "department"),
    location: localized(formData, "location"),
    type: localized(formData, "type"),
    salary: localized(formData, "salary"),
    deadline: deadline || null,
    open: checked(formData, "open"),
    summary: localized(formData, "summary"),
    body: localized(formData, "body"),
  };

  await upsertJob(job, originalSlug || undefined);
  revalidatePath("/admin/tuyen-dung");
  refreshPublic();
  redirect("/admin/tuyen-dung?ok=saved");
}

export async function deleteJob(formData: FormData) {
  await requireAdmin();
  const slug = value(formData, "slug");
  await deleteJobBySlug(slug);
  revalidatePath("/admin/tuyen-dung");
  refreshPublic();
  redirect("/admin/tuyen-dung?ok=deleted");
}

/* ------------------------------------------------------------------ Settings */

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const site = await getSiteUncached();

  const next: SiteData = {
    ...site,
    company: {
      ...site.company,
      displayName: value(formData, "displayName") || site.company.displayName,
      legalName: localized(formData, "legalName"),
      shortName: value(formData, "shortName") || site.company.shortName,
      slogan: localized(formData, "slogan"),
      taxCode: value(formData, "taxCode"),
      domain: value(formData, "domain"),
      foundedYear: numberOrNull(formData, "foundedYear"),
    },
    contact: {
      hotline: value(formData, "hotline"),
      hotlineDisplay: value(formData, "hotlineDisplay"),
      phone: value(formData, "phone"),
      phoneDisplay: value(formData, "phoneDisplay"),
      email: value(formData, "email"),
      careersEmail: value(formData, "careersEmail"),
      zalo: value(formData, "zalo"),
      workingHours: value(formData, "workingHours"),
    },
    social: {
      facebook: value(formData, "facebook"),
      youtube: value(formData, "youtube"),
      linkedin: value(formData, "linkedin"),
      zalo: value(formData, "socialZalo"),
    },
    offices: site.offices.map((office, index) => ({
      ...office,
      name: {
        vi: value(formData, `officeNameVi${index}`) || office.name.vi,
        en: value(formData, `officeNameEn${index}`) || office.name.en,
      },
      address: {
        vi: value(formData, `officeAddressVi${index}`) || office.address.vi,
        en: value(formData, `officeAddressEn${index}`) || office.address.en,
      },
      mapUrl: value(formData, `officeMapUrl${index}`) || office.mapUrl,
      mapEmbed: value(formData, `officeMapEmbed${index}`) || office.mapEmbed,
    })),
    stats: site.stats.map((stat, index) => ({
      value: numberOrNull(formData, `statValue${index}`) ?? stat.value,
      label: {
        vi: value(formData, `statLabelVi${index}`) || stat.label.vi,
        en: value(formData, `statLabelEn${index}`) || stat.label.en,
      },
    })),
    catalogue: {
      pdf: value(formData, "cataloguePdf") || site.catalogue.pdf,
      title: localized(formData, "catalogueTitle"),
      subtitle: localized(formData, "catalogueSubtitle"),
      note: localized(formData, "catalogueNote"),
    },
    clients: {
      ...site.clients,
      showLogos: checked(formData, "showLogos"),
      note: localized(formData, "clientsNote"),
    },
  };

  await saveSiteData(next);
  revalidatePath("/admin/cai-dat");
  refreshPublic();
  redirect("/admin/cai-dat?ok=saved");
}

/* ------------------------------------------------------------------ Banners */

export async function saveBanner(formData: FormData) {
  await requireAdmin();
  const originalId = value(formData, "originalId");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/banner?error=missing-title");

  const banners = await getAllBanners();
  let id = originalId || value(formData, "id") || slugify(title.vi);
  if (!originalId && banners.some((item) => item.id === id)) {
    id = `${id}-${Date.now().toString(36).slice(-4)}`;
  }

  let image = value(formData, "image");
  const upload = formData.get("imageFile");
  if (upload instanceof File && upload.size > 0) {
    const stored = await savePublicUpload(upload, "banners", "image");
    if (!stored.ok) {
      redirect(`/admin/banner?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    image = stored.url;
  }
  if (!image) redirect("/admin/banner?error=missing-image");

  const banner: Banner = {
    id,
    title,
    subtitle: localized(formData, "subtitle"),
    image,
    alt: {
      vi: value(formData, "altVi") || title.vi,
      en: value(formData, "altEn") || title.en || title.vi,
    },
    href: value(formData, "href") || "/vi/lien-he#quote",
    ctaLabel: localized(formData, "ctaLabel"),
    order: numberOrNull(formData, "order") ?? banners.length + 1,
    visible: checked(formData, "visible"),
  };

  await upsertBanner(banner, originalId || undefined);
  revalidatePath("/admin/banner");
  refreshPublic();
  redirect("/admin/banner?ok=saved");
}

export async function deleteBanner(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await deleteBannerById(id);
  revalidatePath("/admin/banner");
  refreshPublic();
  redirect("/admin/banner?ok=deleted");
}

/* ----------------------------------------------------------------- Partners */

export async function savePartner(formData: FormData) {
  await requireAdmin();
  const originalId = value(formData, "originalId");
  const name = value(formData, "name");
  if (!name) redirect("/admin/doi-tac?error=missing-name");

  const partners = await getAllPartners();
  let id = originalId || value(formData, "id") || slugify(name);
  if (!originalId && partners.some((item) => item.id === id)) {
    id = `${id}-${Date.now().toString(36).slice(-4)}`;
  }

  let logo = value(formData, "logo");
  const upload = formData.get("logoFile");
  if (upload instanceof File && upload.size > 0) {
    const stored = await savePublicUpload(upload, "partners", "image");
    if (!stored.ok) {
      redirect(`/admin/doi-tac?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    logo = stored.url;
  }

  const partner: Partner = {
    id,
    name,
    logo: logo || null,
    url: value(formData, "url"),
    order: numberOrNull(formData, "order") ?? partners.length + 1,
    visible: checked(formData, "visible"),
  };

  await upsertPartner(partner, originalId || undefined);
  revalidatePath("/admin/doi-tac");
  refreshPublic();
  redirect("/admin/doi-tac?ok=saved");
}

export async function deletePartner(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await deletePartnerById(id);
  revalidatePath("/admin/doi-tac");
  refreshPublic();
  redirect("/admin/doi-tac?ok=deleted");
}

/* -------------------------------------------------------- Capability files */

const capabilityKinds: CapabilityKind[] = ["profile", "brochure", "certificate", "other"];

export async function saveCapability(formData: FormData) {
  await requireAdmin();
  const originalId = value(formData, "originalId");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/ho-so?error=missing-title");

  const docs = await getAllCapabilityDocs();
  let id = originalId || value(formData, "id") || slugify(title.vi);
  if (!originalId && docs.some((item) => item.id === id)) {
    id = `${id}-${Date.now().toString(36).slice(-4)}`;
  }

  let file = value(formData, "file");
  const upload = formData.get("fileUpload");
  if (upload instanceof File && upload.size > 0) {
    const stored = await savePublicUpload(upload, "capabilities", "document");
    if (!stored.ok) {
      redirect(`/admin/ho-so?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    file = stored.url;
  }
  if (!file) redirect("/admin/ho-so?error=missing-file");

  let cover = value(formData, "cover");
  const coverUpload = formData.get("coverFile");
  if (coverUpload instanceof File && coverUpload.size > 0) {
    const stored = await savePublicUpload(coverUpload, "capabilities", "image");
    if (!stored.ok) {
      redirect(`/admin/ho-so?error=${stored.error === "size" ? "too-large" : "invalid-file"}`);
    }
    cover = stored.url;
  }

  const kindRaw = value(formData, "kind") as CapabilityKind;
  const doc: CapabilityDoc = {
    id,
    title,
    description: localized(formData, "description"),
    file,
    cover: cover || null,
    kind: capabilityKinds.includes(kindRaw) ? kindRaw : "other",
    order: numberOrNull(formData, "order") ?? docs.length + 1,
    visible: checked(formData, "visible"),
  };

  await upsertCapabilityDoc(doc, originalId || undefined);
  revalidatePath("/admin/ho-so");
  refreshPublic();
  redirect("/admin/ho-so?ok=saved");
}

export async function deleteCapability(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await deleteCapabilityDocById(id);
  revalidatePath("/admin/ho-so");
  refreshPublic();
  redirect("/admin/ho-so?ok=deleted");
}

/* ------------------------------------------------------------- Import docs */

export async function importDocumentAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/nhap-lieu?error=missing-file");
  }
  if (file.size > 25 * 1024 * 1024) {
    redirect("/admin/nhap-lieu?error=too-large");
  }

  let doc: Awaited<ReturnType<typeof extractDocument>> | null = null;
  try {
    doc = await extractDocument(file.name, Buffer.from(await file.arrayBuffer()));
  } catch {
    redirect("/admin/nhap-lieu?error=extract-failed");
  }
  if (!doc) redirect("/admin/nhap-lieu?error=extract-failed");

  const target = value(formData, "target") === "project" ? "project" : "article";
  const titleOverride = value(formData, "title");
  const title = titleOverride || doc.title;
  const categoryRaw = value(formData, "category") as ArticleCategory | "auto";
  const useAuto = categoryRaw === "auto" || !categoryRaw;
  const category = useAuto
    ? doc.category
    : articleCategories.includes(categoryRaw as ArticleCategory)
      ? (categoryRaw as ArticleCategory)
      : doc.category;
  const published = checked(formData, "published");

  if (target === "project") {
    const projects = await getProjectsUncached();
    let id = slugify(title);
    if (projects.some((item) => item.id === id)) {
      id = `${id}-${Date.now().toString(36).slice(-4)}`;
    }
    const storedDoc = await savePublicUpload(file, "documents", "document");
    const project: Project = {
      id,
      name: title,
      nameEn: value(formData, "titleEn") || title,
      scope: { vi: doc.excerpt, en: value(formData, "excerptEn") || doc.excerpt },
      location: { vi: doc.projectMeta.location, en: doc.projectMeta.location },
      year: doc.projectMeta.year,
      status: doc.projectMeta.status,
      categories: doc.projectMeta.categories,
      featured: false,
      allowPublic: published,
      image: null,
      clientLogo: null,
      body: { vi: doc.body, en: value(formData, "bodyEn") || "" },
      gallery: [],
      documents: storedDoc.ok ? [{ title, file: storedDoc.url }] : [],
      sector: { vi: doc.projectMeta.sector, en: doc.projectMeta.sector },
      client: { vi: doc.projectMeta.client, en: doc.projectMeta.client },
      duration: { vi: doc.projectMeta.duration, en: doc.projectMeta.duration },
    };
    await upsertProject(project);
    revalidatePath("/admin/du-an");
    refreshPublic();
    redirect(`/admin/du-an/${id}?ok=saved`);
  }

  const articles = await getAllArticles();
  let slug = slugify(title);
  if (articles.some((item) => item.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const article: Article = {
    slug,
    category,
    title: { vi: title, en: value(formData, "titleEn") || title },
    excerpt: {
      vi: value(formData, "excerpt") || doc.excerpt,
      en: value(formData, "excerptEn") || doc.excerpt,
    },
    body: { vi: doc.body, en: value(formData, "bodyEn") || "" },
    date: value(formData, "date") || new Date().toISOString().slice(0, 10),
    readingMinutes: doc.readingMinutes,
    published,
    image: null,
    autoCategory: useAuto,
    sourceFile: file.name,
    tags: doc.tags,
  };

  await upsertArticle(article);
  revalidatePath("/admin/tin-tuc");
  refreshPublic();
  redirect(`/admin/tin-tuc/${slug}?ok=saved`);
}

/* --------------------------------------------------------- Content overrides */

export async function saveContentEntry(formData: FormData) {
  await requireAdmin();
  const key = value(formData, "key");
  if (!key) redirect("/admin/noi-dung?error=missing-key");

  await setContentOverrideBoth(key, {
    vi: value(formData, "vi"),
    en: value(formData, "en"),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/noi-dung");
  redirect("/admin/noi-dung?ok=saved");
}

export async function resetContentEntry(formData: FormData) {
  await requireAdmin();
  const key = value(formData, "key");
  await deleteContentOverride(key);
  revalidatePath("/", "layout");
  revalidatePath("/admin/noi-dung");
  redirect("/admin/noi-dung?ok=deleted");
}

export async function resetAllContentEntries() {
  await requireAdmin();
  await resetAllContentOverrides();
  revalidatePath("/", "layout");
  revalidatePath("/admin/noi-dung");
  redirect("/admin/noi-dung?ok=deleted");
}

export async function saveAboutSiteAction(formData: FormData) {
  await requireAdmin();
  const site = await getSiteUncached();
  const introVi = value(formData, "aboutIntroVi");
  const introEn = value(formData, "aboutIntroEn");
  const visionVi = value(formData, "visionVi")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const visionEn = value(formData, "visionEn")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const missionVi = value(formData, "missionVi")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const missionEn = value(formData, "missionEn")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  const visionCount = Math.max(visionVi.length, visionEn.length);
  const vision =
    visionCount > 0
      ? Array.from({ length: visionCount }, (_, i) => ({
          vi: visionVi[i] ?? visionEn[i] ?? "",
          en: visionEn[i] ?? visionVi[i] ?? "",
        }))
      : site.about.vision;

  const missionCount = Math.max(missionVi.length, missionEn.length);
  const mission =
    missionCount > 0
      ? Array.from({ length: missionCount }, (_, i) => ({
          vi: missionVi[i] ?? missionEn[i] ?? "",
          en: missionEn[i] ?? missionVi[i] ?? "",
        }))
      : site.about.mission;

  await saveSiteData({
    ...site,
    about: {
      ...site.about,
      intro: {
        vi: introVi || site.about.intro.vi,
        en: introEn || site.about.intro.en,
      },
      vision,
      mission,
    },
  });

  revalidatePath("/admin/noi-dung");
  refreshPublic();
  redirect("/admin/noi-dung?ok=saved");
}
