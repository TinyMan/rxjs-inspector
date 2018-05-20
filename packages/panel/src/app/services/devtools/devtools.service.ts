import { Injectable, NgZone } from '@angular/core';
import { ConnectionService } from './connection.service';
import { Store, Action } from '@ngrx/store';
import { NotificationAction } from '../../store/observables/action';
import { Notif } from '@rxjs-inspector/core';
import {
  EventType,
  DevtoolsEvent,
  DevtoolsNotifEvent,
} from '@rxjs-inspector/devtools';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BatchAction } from '../../store';

declare var window: Window & { [k: string]: any };

function isNotif(e: DevtoolsEvent): e is DevtoolsNotifEvent {
  return e.type === EventType.NOTIF;
}

function toAction(e: DevtoolsEvent): Action {
  switch (e.type) {
    case EventType.NOTIF:
      return new NotificationAction({
        ...e.notif,
        value: e.notif.value && JSON.parse(e.notif.value),
      } as Notif);
    case EventType.BATCH:
      return new BatchAction(e.batch.map(toAction));
    default:
      return { type: '' };
  }
}
@Injectable({
  providedIn: 'root',
})
export class DevtoolsService {
  constructor(
    private connection: ConnectionService,
    private store: Store<Action>,
    private _zone: NgZone
  ) {
    console.log('Devtools Service!');

    this.connection.messages$.subscribe((m: DevtoolsEvent) =>
      _zone.run(() => {
        this.store.dispatch(toAction(m));
      })
    );
    window.connection = this.connection;
  }
}
