'use strict'

const { agartha } = require('hephaestus');

const appUrl = agartha.get('EXAMPLE_APP_URL');

module.exports = exports = {
  appName: 'Hephaestus bare site',
  shortName: 'hephaestus-site-bare',
  appUrl: (appUrl) ? appUrl : 'http://127.0.0.1:8080',
  version: '0.0.1',
  hephaestus: '2.0.0'
}
