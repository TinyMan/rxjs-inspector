import {
  of,
  Observable,
  Notification,
  Subscription,
  PartialObserver,
  Subscriber,
} from 'rxjs';
import { share, refCount, publish } from 'rxjs/operators';

export const subscribe_patched = Symbol();

export interface Notif {
  observable: Observable<any>;
  tag?: string;
  id?: string;
  kind: 'N' | 'E' | 'C' | 'S' | 'U';
  value?: any;
}

export class Wrapper<T> extends Subscriber<T> {
  constructor(
    private observable: Observable<T>,
    private hook: Subscriber<Notif>,
    destinationOrNext?: PartialObserver<any> | ((value: T) => void),
    error?: (e?: any) => void,
    complete?: () => void
  ) {
    super(destinationOrNext, error, complete);
    this.hook.next({
      kind: 'S',
      observable: this.observable,
    });
  }
  _next(value: T) {
    this.destination.next && this.destination.next(value);
    this.hook.next({
      observable: this.observable,
      kind: 'N',
      value,
    });
  }
  _error(err: any) {
    this.destination.error && this.destination.error(err);
    this.hook.next({
      observable: this.observable,
      kind: 'E',
      value: err,
    });
  }
  _complete() {
    this.destination.complete && this.destination.complete();
    this.hook.next({
      observable: this.observable,
      kind: 'C',
    });
  }

  unsubscribe() {
    super.unsubscribe();
    this.hook.next({
      kind: 'U',
      observable: this.observable,
    });
  }
}

export function patch(
  proto: typeof Observable.prototype & {
    [subscribe_patched]?: Observable<Notif>;
  }
) {
  if (!proto.hasOwnProperty(subscribe_patched)) {
    const original = proto.subscribe;
    proto[subscribe_patched] = new Observable<Notif>(subscriber => {
      proto.subscribe = function subscribe<T>(
        this: Observable<T>,
        destinationOrNext?: PartialObserver<any> | ((value: T) => void),
        error?: (e?: any) => void,
        complete?: () => void
      ): Subscription {
        const wrapper = new Wrapper(
          this,
          subscriber,
          destinationOrNext,
          error,
          complete
        );
        const sink = original.call(this, wrapper) as Subscriber<T>;
        return sink;
      };
      return () => {
        proto.subscribe = original;
      };
    }).pipe(publish(), refCount());
  }
  return proto[subscribe_patched]!;
}
