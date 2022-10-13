import Mirador from 'mirador/dist/es/src/index'

import { miradorImageToolsPlugin } from 'mirador-image-tools'

import { defaultConfig } from './viewerConfig.js'

const uuid = 'mirador-app'

const elem = document.getElementById(uuid)

const endpoint = elem.dataset.endpoint

const identifier = elem.dataset.identifier

const resourceType = elem.dataset.type

const canvasIndexValue = 0 

const manifestId = `${endpoint}/api/presentation/${resourceType}/${identifier}/manifest.json`

const config = { 
  ...defaultConfig, 
  ...{
    id: uuid,
    language: 'en',
    availableLanguages: {
      ar: 'Arabic',
      en: 'English',
    },
    windows: [
      {
        manifestId: manifestId,
        imageToolsEnabled: true,
        imageToolsOpen: false,
        canvasIndex: canvasIndexValue,
        view: 'single',
      }
    ],
  }
}

console.log(config)

Mirador.viewer(config, [
  ...miradorImageToolsPlugin,
])
