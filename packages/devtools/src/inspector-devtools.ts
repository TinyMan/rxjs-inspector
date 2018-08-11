import { setup, Notif } from '@rxjs-inspector/core';
import { Observable, Subscription } from 'rxjs';
import { EXTENSION_KEY, EventType } from './constants';
import {
  DevtoolsHook,
  DevtoolsNotifEvent,
  DevtoolsBatchEvent,
  DevtoolsInitEvent,
  IDevtoolsEvent,
} from './types';
import { bufferTime } from 'rxjs/operators';
import { stringify } from 'circular-json';
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
  private subscription: Subscription | null = null;
  constructor(private window: Window & { [EXTENSION_KEY]?: DevtoolsHook }) {
    if (window.hasOwnProperty(EXTENSION_KEY)) {
      this.extension = window[EXTENSION_KEY] as DevtoolsHook;
      this.window.dispatchEvent(
        new CustomEvent(this.extension.namespace, {
          detail: new DevtoolsInitEvent(),
        })
      );
      this.window.addEventListener(this.extension.output_namespace, message => {
        console.log(message);
        if (message instanceof CustomEvent) {
          this.onBgMessage(message.detail);
        }
      });
      const { notifications$ } = setup();
      this.notifications$ = notifications$;
      this.start();
    }
  }
  private onBgMessage(message: IDevtoolsEvent) {
    switch (message.type) {
      case EventType.START:
        this.start();
        break;
      case EventType.DISCONNECT:
        this.stop();
        break;
      default:
        break;
    }
  }
  private start() {
    if (!this.subscription && this.notifications$) {
      this.subscription = this.notifications$
        .pipe(bufferTime(50))
        .subscribe(buf => buf.length > 0 && this.postBatch(buf));
    }
  }
  private stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  private notifToEvent(notif: Notif) {
    // https://stackoverflow.com/questions/28699159/customevent-detail-tainted
    // every object passed through this interface HAVE to be clonable
    return new DevtoolsNotifEvent({
      ...notif,
      value: stringify(notif.value, replaceErrors),
      observable: undefined,
    });
  }
  private postBatch(batch: Notif[]) {
    if (this.extension) {
      try {
        const event = new CustomEvent(this.extension.namespace, {
          detail: new DevtoolsBatchEvent(batch.map(n => this.notifToEvent(n))),
        });
        this.window.dispatchEvent(event);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
