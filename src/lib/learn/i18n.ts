import type { AppLocale } from '../../i18n';
import type { LearnArticle, LearnCourse } from '../../types/learn';

/**
 * Resolve the locale-appropriate rendering of a learning article.
 * Falls back to English when a Korean field is missing so partial
 * translations still work.
 */
export function resolveArticle(
  article: LearnArticle,
  locale: AppLocale,
): LearnArticle {
  if (locale !== 'ko') return article;
  return {
    ...article,
    title: article.titleKo ?? article.title,
    description: article.descriptionKo ?? article.description,
    html: article.htmlKo ?? article.html,
  };
}

/** Resolve the locale-appropriate rendering of a course (title/description only). */
export function resolveCourse(course: LearnCourse, locale: AppLocale): LearnCourse {
  if (locale !== 'ko') return course;
  return {
    ...course,
    title: course.titleKo ?? course.title,
    description: course.descriptionKo ?? course.description,
    articles: course.articles.map((a) => resolveArticle(a, locale)),
  };
}

/** Whether the article has a Korean translation available. */
export function hasKoTranslation(article: LearnArticle): boolean {
  return Boolean(article.titleKo && article.htmlKo);
}
