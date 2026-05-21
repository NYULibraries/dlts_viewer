import { createElement } from "react";

// Wrap for WindowSideBarInfoPanel — hides the Collection and/or Current Item sections.
export const HideCollection = ({ TargetComponent: TC, showCollection, showCanvasInfo, children, ...props }) => {
  const overrides = {};
  if (!showCollection) overrides.collectionPath = [];
  if (!showCanvasInfo) overrides.canvasIds = [];
  return createElement(TC, { ...props, ...overrides });
};

// Wrap for CanvasInfo — hides the "Current Item" section when showCanvasInfo=false.
export const HideCanvasInfo = ({ TargetComponent: TC, showCanvasInfo, children, ...props }) => {
  if (!showCanvasInfo) return null;
  return createElement(TC, props);
};
