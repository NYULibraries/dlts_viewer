import Mirador from 'mirador/dist/es/src/index'
// import { miradorImageToolsPlugin } from 'mirador-image-tools'
import LanguageSelector from './plugins/language-selector'
import { defaultConfig } from './viewerConfig.js'
import './style.css'

const uuid = 'mirador-app'

const elem = document.getElementById(uuid)

const {
  endpoint,
  identifier,
  type,
  language,
  sequence,
} = elem.dataset

const manifestId = `${endpoint}/api/presentation/${type}/${identifier}/manifest.json`

const config = {
  ...defaultConfig,
  ...{
    id: uuid,
    language,
    windows: [
      {
        manifestId: manifestId,
        imageToolsEnabled: true,
        imageToolsOpen: false,
        canvasIndex: Number(sequence) - 1,
        view: 'single',
        hideWindowTitle: (type === 'photos') ? true: false , // We don't want to show the window title for photos (not metadata to display).
      },
    ],
  },
}

const plugins = [
  // miradorImageToolsPlugin,
  LanguageSelector,
]

console.log('Mirador 4')

// while testing
window.globalThis.viewer = Mirador.viewer(config, plugins)