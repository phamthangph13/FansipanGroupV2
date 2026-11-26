export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized = { vi: string; en: string };

export type ServiceId = "hvac" | "me" | "cooling" | "maintenance";

export interface Service {
  id: ServiceId;
  slug: string;
  code: string;
  title: Localized;
  shortTitle: Localized;
  tagline: Localized;
  short: Localized;
  intro: Localized;
  role: Localized[];
  scope: { title: Localized; items: Localized[] }[];
  audiences: Localized[];
  note?: Localized;
  image?: string | null;
}

export interface Office {
  id: "office" | "factory";
  kind: Localized;
  name: Localized;
  address: Localized;
  mapUrl: string;
  mapEmbed: string;
}

export interface Stat {
  value: number;
  label: Localized;
}

export interface ValueItem {
  title: Localized;
  body: Localized;
}

export interface ProcessStep {
  title: Localized;
  body: Localized;
}

export type HomeSectionId =
  | "hero"
  | "about"
  | "stats"
  | "services"
  | "process"
  | "projects"
  | "catalogue"
  | "news"
  | "clients"
  | "careers"
  | "contact"
  | "certifications"
  | "leadership"
  | "facilities"
  | "testimonials"
  | "faq"
  | "story";

export interface HomeSection {
  id: HomeSectionId;
  enabled: boolean;
  label: Localized;
}

export interface SiteData {
  company: {
    displayName: string;
    legalName: Localized;
    shortName: string;
    slogan: Localized;
    taxCode: string;
    domain: string;
    foundedYear: number | null;
  };
  contact: {
    hotline: string;
    hotlineDisplay: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    careersEmail: string;
    zalo: string;
    workingHours: string;
  };
  offices: Office[];
  stats: Stat[];
  about: {
    intro: Localized;
    vision: Localized[];
    mission: Localized[];
    values: ValueItem[];
    capabilityNote: Localized;
  };
  processIntro: Localized;
  process: ProcessStep[];
  homeSections: HomeSection[];
  sectors: Localized[];
  social: {
    facebook: string;
    youtube: string;
    linkedin: string;
    zalo: string;
  };
  catalogue: {
    pdf: string;
    title: Localized;
    subtitle: Localized;
    note: Localized;
  };
  clients: {
    showLogos: boolean;
    logos: { name: string; src: string }[];
    note: Localized;
  };
}

export type ProjectStatus = "completed" | "in_progress" | "planned";

export interface ProjectDocument {
  title: string;
  file: string;
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  scope: Localized;
  location: Localized;
  year: number | null;
  status: ProjectStatus;
  categories: ServiceId[];
  featured: boolean;
  allowPublic: boolean;
  image: string | null;
  clientLogo: string | null;
  body?: Localized;
  gallery?: string[];
  documents?: ProjectDocument[];
  sector?: Localized;
  client?: Localized;
  duration?: Localized;
}

export type ArticleCategory =
  | "du-an"
  | "dich-vu"
  | "kien-thuc"
  | "tin-tuc"
  | "hoat-dong-noi-bo";

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  date: string;
  readingMinutes: number;
  published: boolean;
  image?: string | null;
  autoCategory?: boolean;
  sourceFile?: string | null;
  tags?: string[];
}

export interface Job {
  slug: string;
  title: Localized;
  department: Localized;
  location: Localized;
  type: Localized;
  salary: Localized;
  deadline: string | null;
  open: boolean;
  summary: Localized;
  body: Localized;
}

export interface Submission {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  need: string;
  message: string;
  locale: Locale;
  read: boolean;
  ipHash?: string;
}

export interface Application {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  jobSlug: string;
  jobTitle: string;
  coverLetter: string;
  cvFile: string | null;
  cvOriginalName: string | null;
  locale: Locale;
  read: boolean;
}

/* ------------------------------------------------------------------ Banners */

export interface Banner {
  id: string;
  title: Localized;
  subtitle: Localized;
  image: string;
  alt: Localized;
  href: string;
  ctaLabel: Localized;
  order: number;
  visible: boolean;
}

/* ------------------------------------------------------------------ Partners */

export interface Partner {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  order: number;
  visible: boolean;
}

/* --------------------------------------------------------- Capability files */

export type CapabilityKind = "profile" | "brochure" | "certificate" | "other";

export interface CapabilityDoc {
  id: string;
  title: Localized;
  description: Localized;
  file: string;
  cover: string | null;
  kind: CapabilityKind;
  order: number;
  visible: boolean;
}

/* --------------------------------------------------------- Content overrides */

export type ContentValue = Partial<Record<Locale, string>>;

export interface ContentStore {
  version: number;
  updatedAt: string;
  entries: Record<string, ContentValue>;
}

/* ---------------------------------------------------------------- Analytics */

export interface AnalyticsDay {
  date: string;
  views: number;
  visitors: string[];
  pages: Record<string, number>;
  referrers: Record<string, number>;
  devices: Record<string, number>;
  locales: Record<string, number>;
}

export interface AnalyticsData {
  version: number;
  updatedAt: string;
  days: Record<string, AnalyticsDay>;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalVisitors: number;
  todayViews: number;
  todayVisitors: number;
  last7Views: number;
  last30Views: number;
  days: AnalyticsDay[];
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; views: number }[];
  devices: { device: string; views: number }[];
  locales: { locale: string; views: number }[];
}
