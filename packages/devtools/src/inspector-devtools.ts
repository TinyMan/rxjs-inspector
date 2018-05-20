import { setup, Notif } from '@rxjs-inspector/core';
import { Observable } from 'rxjs';
import { EXTENSION_KEY, EventType } from './constants';
import { DevtoolsHook } from './types';
function replaceErrors(key: any, value: any) {
  if (value instanceof Error) {
    let error: { [key: string]: any } = {};

    Object.getOwnPropertyNames(value).forEach(function(key) {
      error[key] = (value as any)[key];
    });

    return error;
  }

  return value;
}

export class InspectorDevtools {
  private notifications$: Observable<Notif> | null = null;
  private extension: DevtoolsHook | null = null;
  constructor(private window: Window & { [EXTENSION_KEY]?: DevtoolsHook }) {
    if (window.hasOwnProperty(EXTENSION_KEY)) {
      this.extension = window[EXTENSION_KEY] as DevtoolsHook;
      this.window.dispatchEvent(
        new CustomEvent(this.extension.namespace, {
          detail: {
            type: EventType.INIT,
          },
        })
      );

      const { notifications$ } = setup();
      this.notifications$ = notifications$;
      this.notifications$.subscribe(notif => this.onNotification(notif));
    }
  }
  private onNotification(notif: Notif) {
    if (this.extension) {
      this.window.dispatchEvent(
        // https://stackoverflow.com/questions/28699159/customevent-detail-tainted
        // every object passed through this interface HAVE to be clonable
        new CustomEvent(this.extension.namespace, {
          detail: {
            notif: {
              ...notif,
              value: JSON.stringify(notif.value, replaceErrors),
              observable: undefined,
            },
            type: EventType.NOTIF,
          },
        })
      );
    }
  }
}
