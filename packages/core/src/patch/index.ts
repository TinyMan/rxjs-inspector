import { Observable } from 'rxjs';

import { lift } from './lift';
import { patch, Notif } from './subscribe';

export { Notif };

export function setup() {
  lift(Observable.prototype, {});
  return {
    notifications$: patch(Observable.prototype),
  };
}
