import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { getCanvasIndex, getCanvases } from "mirador";

// Photos: hide Mirador's default "N of M" line under the image.
const HideViewerInfo = () => null;

// Pull the prev/next buttons out of Mirador's nav wrapper (display: contents)
// so they can share a 3-column grid with the index label.
const Root = styled("div")({
  display: "grid",
  gridTemplateColumns: "auto auto auto",
  alignItems: "center",
  "& .mirador-osd-navigation": {
    display: "contents",
  },
  "& .mirador-previous-canvas-button": {
    order: 1,
  },
  "& .mirador-next-canvas-button": {
    order: 3,
  },
});

// Caption matches ViewerInfo's original type. Order 2 sits between the arrows.
const Index = styled(Typography)({
  order: 2,
  padding: "0 0.5rem",
  whiteSpace: "nowrap",
});

const NavIndex = ({ TargetComponent: TC, targetProps, canvasCount, canvasIndex }) => {
  const { t } = useTranslation();
  const dir = targetProps.viewingDirection === "right-to-left" ? "rtl" : "ltr";
  // Manifest not loaded/undefined - hide the label. Empty manifest - "0 of 0".
  // TODO: separate this when single photo/ multi photo is differentiated.
  const countIsKnown = typeof canvasCount === "number";
  const current = canvasCount === 0 ? 0 : canvasIndex + 1;

  return (
    <Root dir={dir}>
      <TC {...targetProps} />
      {countIsKnown && (
        <Index variant="caption" display="inline" role="status">
          {t("pagination", { current, total: canvasCount })}
        </Index>
      )}
    </Root>
  );
};

// Two wraps: this file exports an array, so index.js must spread it into plugins.
// HideViewerInfo: hide the "N of M" label Mirador adds by default.
// NavIndex: displays "N of M" between the previous and next canvas buttons.
export default [
  {
    target: "ViewerInfo",
    mode: "wrap",
    component: HideViewerInfo,
  },
  {
    target: "ViewerNavigation",
    mode: "wrap",
    component: NavIndex,
    // Read canvas position from Mirador's Redux store via selectors.
    mapStateToProps: (state, props) => {
      const windowId = props.windowId || props.targetProps?.windowId;
      return {
        canvasCount: getCanvases(state, { windowId }).length,
        canvasIndex: getCanvasIndex(state, { windowId }),
      };
    },
  },
];
