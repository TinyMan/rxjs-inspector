import { setup, Notif } from '@rxjs-inspector/core';
import { Observable } from 'rxjs';
import { EXTENSION_KEY, EventType } from './constants';
import { DevtoolsHook } from './types';

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
        new CustomEvent(this.extension.namespace, {
          detail: {
            notif: { ...notif, observable: undefined },
            type: EventType.NOTIF,
          },
        })
      );
    }
  }
}
