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
  }
  _next(value: T) {
    this.hook.next({
      observable: this.observable,
      kind: 'N',
    });
    this.destination.next!(value);
  }
  _error(err: any) {
    this.hook.next({
      observable: this.observable,
      kind: 'E',
    });
    this.destination.error!(err);
  }
  _complete() {
    this.hook.next({
      observable: this.observable,
      kind: 'C',
    });
    this.destination.complete!();
  }
}

export function subscribe(
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
