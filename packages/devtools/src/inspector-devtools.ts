import { setup, Notif } from '@rxjs-inspector/core';
import { Observable } from 'rxjs';
import { EXTENSION_KEY, EventType } from './constants';
import {
  DevtoolsHook,
  DevtoolsNotifEvent,
  DevtoolsBatchEvent,
  DevtoolsInitEvent,
} from './types';
import { bufferTime } from 'rxjs/operators';
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
          detail: new DevtoolsInitEvent(),
        })
      );

      const { notifications$ } = setup();
      this.notifications$ = notifications$;
      this.notifications$
        .pipe(bufferTime(50))
        .subscribe(buf => buf.length > 0 && this.postBatch(buf));
    }
  }
  private notifToEvent(notif: Notif) {
    // https://stackoverflow.com/questions/28699159/customevent-detail-tainted
    // every object passed through this interface HAVE to be clonable
    return new DevtoolsNotifEvent({
      ...notif,
      value: JSON.stringify(notif.value, replaceErrors),
      observable: undefined,
    });
  }
  private postBatch(batch: Notif[]) {
    if (this.extension) {
      const event = new CustomEvent(this.extension.namespace, {
        detail: new DevtoolsBatchEvent(batch.map(n => this.notifToEvent(n))),
      });
      this.window.dispatchEvent(event);
    }
  }
}
