import i18n from "i18next";                      
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
export const supportedLngs = {
  en: "English",
  fr: "Francais",
  ar: "Arabic (العربية)",
};

const detectionOptions = {
  order: ['querystring', 'navigator'],
  caches: [],
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({               
    //lng: "en",
    fallbackLng: "en",
    supportedLngs: Object.keys(supportedLngs),
    detection:detectionOptions,
    debug: true,
    ns: ['translation', 'red_black'],
    defaultNS: 'translation',

    // React does this escaping itself, so we turn 
    // it off in i18next.
    interpolation: {
      escapeValue: false,
    },

    // Translation messages. Add any languages
    // you want here.
    resources: {
      // English
      en: {
        // `translation` is the default namespace.
        // More details about namespaces shortly.
        translation: {
          hello_world: "Hello, World!",
        },
        red_black: {
          compare_values: "Compare {{value1}} to {{value2}}",
          remove_node: "Remove",
          clear_all_nodes: "Clear All",
        },
      },
      // french
      fr: {
        translation: {
          hello_world: "french world",
        },
        red_black: {
          compare_values: "fr comp {{value1}}, {{value2}}",

        },
      },
      // Arabic
      ar: {
        translation: {
          hello_world: "مرحباً بالعالم!",
        },
      },
    },
  });

export default i18n;