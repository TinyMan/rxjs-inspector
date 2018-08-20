import { Observable, ConnectableObservable } from 'rxjs';

import { lift } from './lift';
import { patch, Notif, NotificationKind } from './subscribe';

export { Notif, NotificationKind };

export function setup(): {
  notifications$: ConnectableObservable<Notif>;
} {
  lift(Observable.prototype, {});
  return {
    notifications$: patch(Observable.prototype),
  };
}
