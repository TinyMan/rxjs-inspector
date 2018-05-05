import { EventEmitter } from 'events';

export const enum Events {
  Disconnect = 'DISCONNECT',
}

export class Connection extends EventEmitter {
  constructor(private port: chrome.runtime.Port) {
    super();
    this.port.onDisconnect.addListener(() => this.cleanup());
    this.port.onMessage.addListener(message => this.onMessage(message));
  }

  private cleanup() {
    this.emit(Events.Disconnect);
  }
  private onMessage(message: any) {
    console.log('message', message);
  }

  public postMesage(message: object) {
    console.log('posting message', message);
    this.port.postMessage(message);
  }
}
