import { ConnectionNames } from '@rxjs-inspector/devtools';

interface Link {
  panel?: chrome.runtime.Port;
  content_script?: chrome.runtime.Port;
  id: string;
}
const links: Record<string, Link> = {};

function toContentScript(id: string) {
  return (message: any) => {
    const target = links[id] && links[id].content_script;
    if (target) target.postMessage(message);
  };
}
function toMonitors(id: string) {
  return (message: any) => {
    const target = links[id] && links[id].panel;
    if (target) target.postMessage(message);
  };
}
function registerMonitor(id: string, port: chrome.runtime.Port) {
  const link = links[id] || {};
  if (link.panel) {
    // unregister panel
  }
  link.panel = port;
  port.onMessage.addListener(toContentScript(id));
  links[id] = link;
}
function registerContentScript(id: string, port: chrome.runtime.Port) {
  const link = links[id] || {};
  if (link.content_script) {
    // unregister content_script
  }
  link.content_script = port;
  port.onMessage.addListener(toMonitors(id));
  links[id] = link;
}

function isMonitored(id: string) {
  return !!(links[id] && links[id].panel);
}
function start(id: string) {}

chrome.runtime.onConnectExternal.addListener(onConnect);
chrome.runtime.onConnect.addListener(onConnect);

function onConnect(port: chrome.runtime.Port) {
  const id = (
    (port.sender && port.sender.tab && port.sender.tab.id) ||
    port.name
  ).toString();

  console.log('Incoming connection !', port, id);

  const isContentScript = port.name === ConnectionNames.CONTENT_SCRIPT;
  if (!isContentScript) {
    registerMonitor(id, port);
  } else {
    registerContentScript(id, port);
    if (isMonitored(id)) {
      start(id);
    }
  }
}

console.log('Init');
