import Mirador from 'mirador/dist/es/src/index';
import { miradorImageToolsPlugin } from 'mirador-image-tools';

const uuid = 'mirador-app';

const elem = document.getElementById(uuid);

const endpoint = elem.dataset.endpoint;

const identifier = elem.dataset.identifier;

const resourceType = elem.dataset.type;

const canvasIndexValue = 0;

const manifestId = `${endpoint}/api/presentation/${resourceType}/${identifier}/manifest.json`;

const config = {
  id: uuid, 
  workspaceControlPanel: {
    enabled: false,
  },
  workspace: { 
    isWorkspaceAddVisible: false,
    allowNewWindows: false,
  },
  language: 'en',
  windows: [
    {
      manifestId: manifestId,
      imageToolsEnabled: true,
      imageToolsOpen: false,
      canvasIndex: canvasIndexValue,
      view: 'single',
    }
  ],
  window: {
    allowClose: false,
    defaultSideBarPanel: 'info',
    sideBarOpenByDefault: true, 
    showLocalePicker: true,
    hideWindowTitle: true,
  }, 
}

Mirador.viewer(config, [
  ...miradorImageToolsPlugin,
]);
