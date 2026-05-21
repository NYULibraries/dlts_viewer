// CollectionInfoPlugin.jsx is kept as an unused template.
// To restore/customise the Collection section, see CollectionInfoPlugin.jsx.
//
// This module exports two wrap plugins that control info panel section visibility:
//
//   data-show-canvas-info="false"   → hides "Current Item" but keeps LanguageSelector visible
//   data-show-collection="false"    → hides "Collection"

import { HideCollection, HideCanvasInfo } from "./CollectionHide.jsx";

export default [
  {
    target: "WindowSideBarInfoPanel",
    mode: "wrap",
    component: HideCollection,
    mapStateToProps: (state) => ({
      showCollection: state.config?.dlts?.showCollection !== false,
      showCanvasInfo: state.config?.dlts?.showCanvasInfo !== false,
    }),
  },
  {
    target: "CanvasInfo",
    mode: "wrap",
    component: HideCanvasInfo,
    mapStateToProps: (state) => ({
      showCanvasInfo: state.config?.dlts?.showCanvasInfo !== false,
    }),
  },
];
