import { Observable } from 'rxjs';

import { lift } from './lift';
import { patch, Notif, NotificationKind } from './subscribe';

export { Notif, NotificationKind };

export function setup() {
  lift(Observable.prototype, {});
  return {
    notifications$: patch(Observable.prototype),
  };
}
