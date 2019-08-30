'use strict';

const { appDir, Command, read, readdirSync, write } = require('hephaestus');

const { extname } = require('path');

const { EOL } = require('os');

const prettier = require('prettier');

module.exports = exports = class HephaestusCommandExample extends Command {

  get command () {
    return 'chunk';
  }

  get description () {
    return 'Echo this command description';
  }

  action () {

    let base = read.text(`${appDir()}/entrypoint.js`);

    [
      { file: `${appDir()}/lib/openseadragon/openseadragon.js`, match: 'hephastusAddLibOpenSeadragon' },
      { directory: `${appDir()}/lib/yui3`, match: '// hephastusAddLibYUI3'},
      { directory: `${appDir()}/lib/chunks`, match: '// hephastusAddFn'},
    ].map(library => {
      let fnOut = '';
      if (library.directory) {
        readdirSync(`${library.directory}`).forEach(chunk => {
          if (extname(chunk) === '.js') {
            fnOut += EOL;
            fnOut += read.text(`${library.directory}/${chunk}`);
            fnOut += EOL;
          }
        });
      } else if (library.file) {
        if (extname(library.file) === '.js') {
          fnOut += EOL;
          fnOut += read.text(library.file);
          fnOut += EOL;
        }
      }
      base = base.replace(library.match, fnOut);
    });

    write(`${appDir()}/dlts_viewer.js`, prettier.format(base, { semi: true, parser: 'babel' }));

  }

};
