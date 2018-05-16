import { Injectable, NgZone } from '@angular/core';
import { ConnectionService } from './connection.service';
import { Store, Action } from '@ngrx/store';
import { NotificationAction } from '../../store/observables/action';
import { Notif } from '@rxjs-inspector/core';

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

    this.connection.messages$.subscribe(m =>
      _zone.run(() => {
        switch (m.type) {
          case 'notif':
            console.log(m.notif);
            this.store.dispatch(new NotificationAction(m.notif as Notif));
            break;
        }
      })
    );
    window.connection = this.connection;
  }
}
