import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ko from './locales/ko.json';

export type AppLocale = 'en' | 'ko';
export const SUPPORTED_LOCALES: AppLocale[] = ['en', 'ko'];
export const DEFAULT_LOCALE: AppLocale = 'en';

const LOCALE_STORAGE_KEY = 'app-locale';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    load: 'languageOnly',
  });

/** Coerce arbitrary language string to a supported AppLocale. */
export function normalizeLocale(raw: string | undefined | null): AppLocale {
  if (!raw) return DEFAULT_LOCALE;
  const base = raw.split('-')[0].toLowerCase();
  return (SUPPORTED_LOCALES as string[]).includes(base) ? (base as AppLocale) : DEFAULT_LOCALE;
}

export function getCurrentLocale(): AppLocale {
  return normalizeLocale(i18n.language);
}

export function changeLocale(locale: AppLocale): void {
  void i18n.changeLanguage(locale);
}

export { LOCALE_STORAGE_KEY };
export default i18n;
