import { getWindowConfig, getWindowViewType, getViewer, updateViewport, updateWindow } from 'mirador';
import MiradorImageTools from './MiradorImageTools.jsx';
import MiradorImageToolsFilter from './MiradorImageToolsFilter.js';
import translations from './translations.js';

export const miradorImageToolsPlugin = [
  {
    component: MiradorImageToolsFilter,
    mapStateToProps: (state, { windowId }) => ({
      enabled: getWindowConfig(state, { windowId }).imageToolsEnabled || false,
      viewConfig: getViewer(state, { windowId }) || {},
    }),
    mode: 'add',
    target: 'OpenSeadragonViewer',
  },
  {
    component: MiradorImageTools,
    config: {
      translations,
    },
    mapDispatchToProps: {
      updateViewport,
      updateWindow,
    },
    mapStateToProps: (state, { windowId }) => ({
      enabled: (getWindowConfig(state, { windowId }).imageToolsEnabled || false)
        && getWindowViewType(state, { windowId }) !== 'gallery',
      open: getWindowConfig(state, { windowId }).imageToolsOpen || false,
      viewConfig: getViewer(state, { windowId }) || {},
    }),
    mode: 'add',
    target: 'WindowTopBarPluginArea',
  },
];
