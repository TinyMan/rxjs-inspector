import { ConnectionNames } from '@rxjs-inspector/devtools';

let panel: chrome.runtime.Port | undefined;
let content_script: chrome.runtime.Port | undefined;

chrome.runtime.onConnectExternal.addListener(onConnect);
chrome.runtime.onConnect.addListener(onConnect);

function onConnect(port: chrome.runtime.Port) {
  console.log('Incoming connection !', port);
  if (port.name === ConnectionNames.PANEL) {
    if (panel) panel.disconnect();
    panel = port;
    port.onMessage.addListener(message => {
      if (content_script) content_script.postMessage(message);
    });
  } else if (port.name === ConnectionNames.CONTENT_SCRIPT) {
    if (content_script) content_script.disconnect();
    content_script = port;
    port.onMessage.addListener(message => {
      if (panel) panel.postMessage(message);
    });
  }
}

console.log('Init');
