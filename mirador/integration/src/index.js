import Mirador from 'mirador/dist/es/src/index';

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
  languages, 
  sequence,
} = elem.dataset

const viewerLanguages =  languages.split(',')

const manifestId = `${endpoint}/api/presentation/${type}/${identifier}/manifest.json`

const config = { 
  ...defaultConfig, 
  ...{
    id: uuid,
    language,
    viewerLanguages,
    windows: [
      {
        manifestId: manifestId,
        imageToolsEnabled: true,
        imageToolsOpen: false,
        canvasIndex: Number(sequence),
        view: 'single',
      },
    ],
  },
}

const plugins = [
  miradorImageToolsPlugin,
]

if (viewerLanguages.length > 1) {
  plugins.push(LanguageSelector)
}

Mirador.viewer(config, plugins)
