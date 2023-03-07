import Mirador from 'mirador/dist/es/src/index'

import { miradorImageToolsPlugin } from 'mirador-image-tools'

import { defaultConfig } from './viewerConfig.js'

import LanguageSelector from './plugins/language-selector'

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
        hideWindowTitle: false, // true if Photos
      },
    ],
  },
}

const plugins = [
  miradorImageToolsPlugin,
  LanguageSelector,
]

Mirador.viewer(config, plugins)
