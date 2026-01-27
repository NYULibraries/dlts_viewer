import Mirador from 'mirador';
import { miradorImageToolsPlugin } from 'mirador-image-tools';
import { defaultConfig } from './viewerConfig.js'
import LanguageSelector from './plugins/LanguageSelector.jsx'
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

Mirador.viewer(config, [
  ...miradorImageToolsPlugin,
  LanguageSelector,
])
