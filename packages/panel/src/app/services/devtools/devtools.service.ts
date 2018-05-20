import { Injectable, NgZone } from '@angular/core';
import { ConnectionService } from './connection.service';
import { Store, Action } from '@ngrx/store';
import { NotificationAction } from '../../store/observables/action';
import { Notif } from '@rxjs-inspector/core';
import { EventType, DevtoolsEvent } from '@rxjs-inspector/devtools';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

declare var window: Window & { [k: string]: any };
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

    this.connection.messages$
      .pipe(
        switchMap((m: DevtoolsEvent) => {
          switch (m.type) {
            case EventType.BATCH:
              return of(...m.batch);
            case EventType.NOTIF:
            default:
              return of(m);
          }
        })
      )
      .subscribe(m =>
        _zone.run(() => {
          switch (m.type) {
            case EventType.NOTIF:
              // console.log(m.notif);
              this.store.dispatch(
                new NotificationAction({
                  ...m.notif,
                  value: m.notif.value && JSON.parse(m.notif.value),
                } as Notif)
              );
              break;
          }
        })
      );
    window.connection = this.connection;
  }
}
