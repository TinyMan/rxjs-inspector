import { Injectable } from '@angular/core';
import { Observable, fromEventPattern } from 'rxjs';
import { map, takeUntil, share } from 'rxjs/operators';
import { MessageHandler } from '@devtools/types';
import { ConnectionNames } from '@devtools/enums';

/**
 * Return an observable wrapping the given chrome event
 * @param event the chrome event to observe
 */
function observeChromeEvent(event: chrome.events.Event<MessageHandler>) {
  return fromEventPattern(
    (h: MessageHandler) => event.addListener(h),
    (h: MessageHandler) => event.removeListener(h)
  );
}

const EXT_ID = 'jjcoemihehbckckmokanloalbncficgk';
@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private connection: chrome.runtime.Port;

  public messages$: Observable<any>;
  constructor() {
    console.log('Connection Service!', EXT_ID);
    this.connection = chrome.runtime.connect(EXT_ID, {
      name: ConnectionNames.PANEL,
    });

    this.messages$ = observeChromeEvent(this.connection.onMessage).pipe(
      map(([message]) => message),
      takeUntil(observeChromeEvent(this.connection.onDisconnect)),
      share()
    );
  }

  postMessage(message: any) {
    this.connection.postMessage(message);
  }
}
