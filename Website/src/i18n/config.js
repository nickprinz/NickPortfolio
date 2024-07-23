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
          remove_history: "Remove {{value}}",
          now_history: "Now",
          root: "Insert as Root",
          set_root: "Change root value from {{value1}} to {{value2}}",
          rotate_right: "Rotate {{value}} right",
          rotate_right_color_swap: "Rotate {{value}} right and swap colors",
          rotate_left: "Rotate {{value}} left",
          rotate_left_color_swap: "Rotate {{value}} left and swap colors",
          set_parent: "Set Parent of {{value}} to {{parent}}",
          set_red: "Color {{value}} to Red",
          set_black: "Color {{value}} to Black",
          swap_nodes: "Swap {{value1}} with {{value2}}",
          finished: "Finished",
          first_root: "No other values exist in the tree, this value is just added to the root",
          add_root_black: "Values are usually added as red. By convention, the root is added as black.",
          add_compare_values_less: "Searching for position to add {{value1}}.\nBecause {{value1}} is less than or equal to {{value2}}, the search will move to the left child.",
          add_compare_values_greater: "Searching for position to add {{value1}}.\nBecause {{value1}} is greater than {{value2}}, the search will move to the right child.",
          add_insert_less: "Inserting {{value1}} into the tree as a left child to {{value2}}.",
          add_insert_greater: "Inserting {{value1}} into the tree as a right child to {{value2}}.",
          add_red_parent_uncle: "There is a red-red at {{value1}} and parent({{value2}}). The uncle({{value4}}) is red. Set the parent and uncle to black while changing the grandparent({{value3}}) to red. Check the grandparent for double red. Black depth is unchanged for this subtree",
          add_red_parent_root: "There is a red-red at {{value1}} and parent({{value2}}). Because the parent is the root it can be set to black. The entire tree's black depth increases by 1.",
          add_black_uncle_left_left_child: "There is a red-red at {{value1}} and parent({{value2}}). The uncle({{value4}}) is black. Rotating the grandparent({{value3}}) to the right, swapping colors with {{value2}} will preserve black depth and solve the red-red.",
          add_black_uncle_left_right_child: "There is a red-red at {{value1}} and parent({{value2}}). The uncle({{value4}}) is black. First, rotate {{value2}} to the left to preserve ordering. Then, rotating the grandparent({{value3}}) to the right, swapping colors with {{value1}} will preserve black depth and solve the red-red.",
          add_black_uncle_right_right_child: "There is a red-red at {{value1}} and parent({{value2}}). The uncle({{value4}}) is black. Rotating the grandparent({{value3}}) to the left, swapping colors with {{value2}} will preserve black depth and solve the red-red.",
          add_black_uncle_right_left_child: "There is a red-red at {{value1}} and parent({{value2}}). The uncle({{value4}}) is black. First, rotate {{value2}} to the right to preserve ordering. Then, rotating the grandparent({{value3}}) to the left, swapping colors with {{value1}} will preserve black depth and solve the red-red.",
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