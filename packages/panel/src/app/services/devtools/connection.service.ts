import { Injectable } from '@angular/core';
import { Observable, fromEventPattern } from 'rxjs';
import { map, takeUntil, share, tap } from 'rxjs/operators';
import { MessageHandler, ConnectionNames } from '@rxjs-inspector/devtools';

/**
 * Return an observable wrapping the given chrome event
 * @param event the chrome event to observe
 */
function observeChromeEvent(
  event: chrome.events.Event<MessageHandler>
): Observable<[any, chrome.runtime.Port]> {
  return fromEventPattern(
    h => event.addListener(h as MessageHandler),
    h => event.removeListener(h as MessageHandler)
  );
}

const EXT_ID = 'ikbpcnbldccnepheoagfjgcigncidfbp';
@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private connection: chrome.runtime.Port;

  public messages$: Observable<any>;
  constructor() {
    console.log('Connection Service!', EXT_ID);
    this.connection = chrome.runtime.connect(
      EXT_ID,
      {
        name: chrome.devtools
          ? chrome.devtools.inspectedWindow.tabId.toString()
          : ConnectionNames.PANEL,
      }
    );

    this.messages$ = observeChromeEvent(this.connection.onMessage).pipe(
      map(([message]) => message),
      tap(m => console.log('Message from bg', m)),
      takeUntil(observeChromeEvent(this.connection.onDisconnect)),
      share()
    );
  }

  postMessage(message: any) {
    this.connection.postMessage(message);
  }
}
