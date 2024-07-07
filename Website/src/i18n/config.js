import i18n from "i18next";                 
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const supportedLngs = {
  en: "English",
  fr: "Francais",
  ar: "Arabic (العربية)",
};

const detectionOptions = {
  order: ['querystring', 'navigator'],//there are a lot more options to be added here
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
    //ns: ['translation', 'red_black'], //declaring these doesn't do anything
    defaultNS: 'translation',
    
    // React does this escaping itself, so we turn 
    // it off in i18next.
    interpolation: {
      escapeValue: false,
    },

    resources: {
      // English
      en: {
        //want to separate different projects into their own files within their own project folders
        //loadNamespaces will not help here, it doesn't allow a path to be specified
        //will need a utility to get resources from specified files and merge them before calling init
        translation: {
          hello_world: "Hello, World!",
        },
        red_black: {
          compare_values: "Compare {{value1}} to {{value2}}",
          remove_node: "Remove",
          clear_all_nodes: "Clear All",
          edit_tab: "Edit",
          history_tab: "History",
          add_history: "Add {{value}}",
          now_history: "Now",
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