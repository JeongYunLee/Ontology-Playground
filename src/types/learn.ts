/** A single learning article compiled from Markdown at build time. */
export interface LearnArticle {
  slug: string;
  title: string;
  description: string;
  order: number;
  /** Catalogue ontology ID to embed, e.g. "official/cosmic-coffee" */
  embed?: string;
  /** Human review status, e.g. "under-human-review" */
  reviewStatus?: string;
  /** HTML content rendered from Markdown */
  html: string;
  // ── Optional Korean translations (populated from *.ko.md sibling) ──
  titleKo?: string;
  descriptionKo?: string;
  htmlKo?: string;
}

/** A course groups related articles into a learning path or hands-on lab. */
export interface LearnCourse {
  slug: string;
  title: string;
  description: string;
  type: 'path' | 'lab';
  icon: string;
  articles: LearnArticle[];
  // ── Optional Korean translations (populated from _meta.ko.md) ──
  titleKo?: string;
  descriptionKo?: string;
}

/** The full learn manifest emitted by compile-learn.ts */
export interface LearnManifest {
  generatedAt: string;
  courses: LearnCourse[];
}
