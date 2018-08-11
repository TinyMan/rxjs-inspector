import { ConnectionNames, EventType } from '@rxjs-inspector/devtools';

interface Link {
  panel?: chrome.runtime.Port;
  content_script?: chrome.runtime.Port;
  id: string;
}
/**
 * Collection of links between content scripts and monitors
 */
const links: Record<string, Link> = {};
/**
 * Not yet allocated monitors
 */
const awaitingMonitors: chrome.runtime.Port[] = [];

/**
 * Creates a handler that relays the message to a link's content script
 * @param id id of the link
 */
function toContentScript(id: string) {
  return function messageHandler(message: any) {
    notifyContentScript(id, message);
  };
}
/**
 * Creates a handler that relays the message to a link's monitors
 * @param id id of the link
 */
function toMonitors(id: string) {
  return function messageHandler(message: any) {
    notifyMonitors(id, message);
  };
}
/**
 * Register a devtools panel as a monitor of a content script,
 * start the monitoring if the content script is connected
 * @param id id of the monitored tab and id of the link
 * @param port chrome port used for the connection
 */
function registerMonitor(id: string, port: chrome.runtime.Port) {
  const link = links[id] || {};
  if (link.panel) {
    // unregister panel
  }
  link.panel = port;
  port.onMessage.addListener(toContentScript(id));
  port.onDisconnect.addListener(onDisconnect(id, port));
  links[id] = link;
  if (isCsConnected(id)) start(id);
}
/**
 * Register an incoming connection of a content script,
 * create a link and start the monitoring if the link is monitored
 * @param id id of the content script (tabId) and id of the link
 * @param port chrome port used for the connection
 */
function registerContentScript(id: string, port: chrome.runtime.Port) {
  const link = links[id] || {};
  if (link.content_script) {
    // unregister content_script
  }
  link.content_script = port;
  port.onMessage.addListener(toMonitors(id));
  port.onDisconnect.addListener(onDisconnect(id, port));
  links[id] = link;
  if (isMonitored(id)) start(id);
}
/**
 * Send a message to monitors of a content script
 * @param id id of the link
 * @param message message to send to monitors of the link
 */
function notifyMonitors(id: string, message: any): void {
  console.log('sending message to monitors of ' + id, message);
  const link = links[id];
  if (link && link.panel) {
    link.panel.postMessage(message);
  } else {
    notifyContentScript(id, { type: EventType.DISCONNECT });
  }
}
/**
 * Send a message to content script
 * @param id id of the link
 * @param message message to send to content script
 */
function notifyContentScript(id: string, message: any): void {
  const link = links[id];
  if (link && link.content_script) {
    link.content_script!.postMessage(message);
  } else {
    notifyMonitors(id, { type: EventType.DISCONNECT });
  }
}
/**
 * Check if the link has at least one monitor
 * @param id id of the link
 */
function isMonitored(id: string) {
  return !!(links[id] && links[id].panel);
}
/**
 * Check if the link's content script is connected
 * @param id id of the link
 */
function isCsConnected(id: string) {
  return !!(links[id] && links[id].content_script);
}
/**
 * Begin the monitoring
 * @param id id of the link
 */
function start(id: string) {
  notifyMonitors(id, { type: EventType.START });
  notifyContentScript(id, { type: EventType.START });
}

/**
 * Find an unmonitored content script to attach to
 */
function findUnmonitoredContentScript(): string | undefined {
  return Object.keys(links).find(id => !isMonitored(id));
}

/**
 * Handle an incomming connection from a content script or a devtools panel (a monitor)
 * @param port chrome port of the connection
 */
function onConnect(port: chrome.runtime.Port) {
  console.log('Incoming connection !', port.name);
  let id = (
    (port.sender && port.sender.tab && port.sender.tab.id) ||
    port.name
  ).toString();

  if (port.name === ConnectionNames.CONTENT_SCRIPT) {
    registerContentScript(id, port);
    if (!isMonitored(id) && awaitingMonitors.length > 0) {
      registerMonitor(id, awaitingMonitors.shift()!);
    }
  } else if (port.name === ConnectionNames.PANEL) {
    const unmonitored = findUnmonitoredContentScript();
    if (unmonitored) {
      registerMonitor(unmonitored, port);
    } else {
      awaitingMonitors.push(port);
    }
  } else {
    registerMonitor(id, port);
  }
}

/**
 * Creates a disconnect handler that notifies the other parties of the disconnect
 * @param id id of the link
 * @param port chrome port of the connection
 */
function onDisconnect(id: string, port: chrome.runtime.Port) {
  return function onDisconnectHandler() {
    const link = links[id];
    if (link) {
      if (port.name === ConnectionNames.CONTENT_SCRIPT) {
        notifyMonitors(id, { type: EventType.DISCONNECT });
        link.content_script = undefined;
      } else {
        notifyContentScript(id, { type: EventType.DISCONNECT });
        link.panel = undefined;
      }
    }
  };
}

chrome.runtime.onConnectExternal.addListener(onConnect);
chrome.runtime.onConnect.addListener(onConnect);
console.log('Init');
