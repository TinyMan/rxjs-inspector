import { Connection } from './connection';

const connections: {
  [key: string]: Connection;
} = {};

chrome.runtime.onConnect.addListener(port => {
  const c = new Connection(port);
  connections[port.sender!.id!] = c;
});
