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
          remove_parent: "Remove {{value}} from the tree",
          set_red: "Color {{value}} to Red",
          set_black: "Color {{value}} to Black",
          swap_nodes: "Swap {{value1}} with {{value2}}",
          finished: "Finished",
          first_root: "No other values exist in the tree, this value is added as the root",
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
          remove_from_tree: "{{value1}} has no children. It can be removed from the tree.",
          swap_right_leftmost: "Because {{value1}} has two children it cannot be immediately removed from the tree. {{value1}} must swap position and color with the leftmost value in its right child's subtree({{value2}}).",
          swap_child: "Because {{value1}} has a child({{value2}}) it cannot be immediately removed from the tree. {{value1}} must swap position and color with {{value2}}.",
          remove_black_node_red_sibling_right: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is red, so {{value2}} rotates right and swaps colors with {{value1}}. This does not solve the problem, but does convert it to a problem where the deleted value has a black sibling. The following steps solve the double-black as though the deleted value had a black sibling.",
          remove_black_node_red_sibling_left: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is red, so {{value2}} rotates left and swaps colors with {{value1}}. This does not solve the problem, but does convert it to a problem where the deleted value has a black sibling. The following steps solve the double-black as though the deleted value had a black sibling.",
          remove_black_node_black_sibling_with_black_children_red_parent: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two black children, so {{value1}} can safely be colored red to match the black depth of the sibling subtree. Because {{value2}} is red, it can be colored black. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_black_children_black_parent: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two black children, so {{value1}} can safely be colored red to match the black depth of the sibling subtree. Because {{value2}} is black, there is still a double-black and this subtree's black height has been reduced by one. This process will repeat for {{value2}}'s parent.",
          remove_black_node_black_sibling_with_red_children_right_two_red_children: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two red children. Set the outer child({{value3}}) to black, then rotate {{value2}} right. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_right_two_red_children_red_parent: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two red children. Set the outer child({{value3}}) to black. Because {{value2}} is red, {{value1}} and {{value2}} will need to swap colors to preserve black height after the rotation. Rotate {{value2}} right. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_right_inner_red_child: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has an inner red child({{value1}} is a left child and {{value4}} is a right child). {{value4}}'s color will be set to the same color as {{value1}}. Next, {{value1}} will rotate left and swap colors with {{value4}}. Finally, rotate {{value2}} right. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_right_outer_red_child: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has an outer red child(both {{value1}} and {{value3}} are left children). Set the {{value3}} to have the same color as {{value2}}, then rotate {{value2}} right. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_left_two_red_children: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two red children. Set the outer child({{value3}}) to black, then rotate {{value2}} left. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_left_two_red_children_red_parent: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has two red children. Set the outer child({{value3}}) to black. Because {{value2}} is red, {{value1}} and {{value2}} will need to swap colors to preserve black height after the rotation. Rotate {{value2}} left. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_left_inner_red_child: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has an inner red child({{value1}} is a right child and {{value4}} is a left child). {{value4}}'s color will be set to the same color as {{value1}}. Next, {{value1}} will rotate right and swap colors with {{value4}}. Finally, rotate {{value2}} left. This resolves the double-black and leaves the total black height unchanged.",
          remove_black_node_black_sibling_with_red_children_left_outer_red_child: "The removed value was black, which reduces a subtree's black height by one. This unbalances the tree and creates a double-black to be resolved on the parent({{value2}}). The removed value's sibling({{value1}}) is black and has an outer red child(both {{value1}} and {{value3}} are right children). Set the {{value3}} to have the same color as {{value2}}, then rotate {{value2}} left. This resolves the double-black and leaves the total black height unchanged.",
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