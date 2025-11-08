import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslation from "./locales/en.json";
import hiTranslation from "./locales/hi.json";
import knTranslation from "./locales/kn.json";

i18n
  .use(LanguageDetector) // Detects user language automatically
  .use(initReactI18next) // Passes i18n down to React
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      kn: { translation: knTranslation }
    },
    fallbackLng: "en", // default language
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ['localStorage', 'navigator'], // Check saved language first
      caches: ['localStorage'] // Persist language selection
    }
  });

export default i18n;