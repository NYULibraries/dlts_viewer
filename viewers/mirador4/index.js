import Mirador from 'mirador';
import { miradorImageToolsPlugin } from 'mirador-image-tools';
import { defaultConfig } from './viewerConfig.js'
import LanguageSelector from './plugins/LanguageSelector.jsx'
import createMultiVolumeSelector from './plugins/createMultiVolumeSelector.jsx'
import createBookHistoryPlugin from './plugins/createBookHistoryPlugin.js'
import CollectionInfo from "./plugins/CollectionInfo.jsx";

import './style.css'

const uuid = 'mirador-app'

const elem = document.getElementById(uuid)

const {
  endpoint,
  identifier,
  type,
  language,
  sequence,
  multivolume,
  embeded,
  history,
  search,
  showCanvasInfo,
  showCollection,
  imageTools,
} = elem.dataset

const manifestId = `${endpoint}/api/presentation/${type}/${identifier}/manifest.json`

const plugins = [
  LanguageSelector,
  ...CollectionInfo
]

if (multivolume === 'true') {
  plugins.push(createMultiVolumeSelector({ endpoint, identifier }))
}

if (history === 'true' && embeded !== 'true') {
  plugins.push(createBookHistoryPlugin({ endpoint, identifier }))
}

if (imageTools === 'true' ) {
  plugins.push(...miradorImageToolsPlugin)
}

// Sort wrap plugins by weight (descending) per target.
// Mirador reverses the plugins array before composing wraps, so descending registration
// order → lower weight = innermost (portal committed first = appears first in panel).
function sortWrapsDescending(plugins, target) {
  const wraps = plugins
    .filter(p => p.target === target && p.mode === 'wrap')
    .sort((a, b) => (b.weight ?? 50) - (a.weight ?? 50))
  const others = plugins.filter(p => !(p.target === target && p.mode === 'wrap'))
  return [...wraps, ...others]
}

let sortedPlugins = sortWrapsDescending(plugins, 'WindowSideBarInfoPanel')
sortedPlugins = sortWrapsDescending(sortedPlugins, 'ManifestInfo')

const config = {
  ...defaultConfig,
  ...{
    id: uuid,
    dlts: {
      showCanvasInfo: showCanvasInfo !== "false",
      showCollection: showCollection !== "false",
    },
    language,
    windows: [
      {
        manifestId: manifestId,
        imageToolsEnabled: true,
        imageToolsOpen: false,
        canvasIndex: Number(sequence) - 1,
        view: 'single',
        hideWindowTitle: false,
      },
    ],
  },
}

Mirador.viewer(config, sortedPlugins)
