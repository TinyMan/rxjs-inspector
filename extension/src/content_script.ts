import {
  ConnectionNames,
  EventType,
  EXTENSION_KEY,
  DevtoolsHook,
} from '@rxjs-inspector/devtools';

const NAMESPACE =
  chrome.runtime.id +
  '-' +
  Math.random()
    .toString()
    .split('.')[1]
    .substr(0, 6);

interface Message extends CustomEvent {
  detail: {
    type: string;
    data: any;
  };
}

window.addEventListener(
  NAMESPACE,
  ((): EventListener => {
    let port: chrome.runtime.Port | undefined;
    const messageHandler = (message: any) =>
      console.log('Message received from bg', message);
    return ((message: Message) => {
      console.log('Received message from injected script', message);
      if (message.detail.type === EventType.INIT) {
        if (port) {
          port.disconnect();
          port.onMessage.removeListener(messageHandler);
        }
        port = chrome.runtime.connect({
          name: ConnectionNames.CONTENT_SCRIPT,
        });
        port.onMessage.addListener(messageHandler);
      }
      if (port) {
        port.postMessage(message.detail);
      }
    }) as EventListener;
  })()
);

addScript(
  `;(${setup.toString()}(window, '${NAMESPACE}', '${EXTENSION_KEY}'))`,
  true
);

function setup(window: Window, namespace: string, key: string) {
  Object.defineProperty(window, key, {
    value: {
      namespace,
    } as DevtoolsHook,
  });
}

function addScript(urlOrScript: string, plain = false) {
  let s = document.createElement('script');
  if (!plain) {
    s.src = urlOrScript;
  } else {
    s.innerHTML = urlOrScript;
  }
  (document.head || document.documentElement).appendChild(s);
}
