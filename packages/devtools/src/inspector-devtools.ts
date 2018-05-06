import { setup, Notif } from '@rxjs-inspector/core';
import { Observable } from 'rxjs';

export class InspectorDevtools {
  private notifications$: Observable<Notif>;
  constructor() {
    const { notifications$ } = setup();
    this.notifications$ = notifications$;
  }
}
