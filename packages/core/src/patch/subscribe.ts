import {
  of,
  Observable,
  Notification,
  Subscription,
  PartialObserver,
  Subscriber,
} from 'rxjs';
import { share, refCount, publish } from 'rxjs/operators';
import { tag } from '../util';
import { tag as tagOperator } from '../operators';

export const subscribe_patched = Symbol();

export const enum NotificationKind {
  Next = 'N',
  Error = 'E',
  Complete = 'C',
  Subscribe = 'S',
  Unsubscribe = 'U',
}
export interface Notif {
  observable: Observable<any>;
  tag?: string | symbol;
  id?: string;
  kind: NotificationKind;
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
    this.notifyHook(NotificationKind.Subscribe);
  }

  private notifyHook(kind: NotificationKind, value?: any) {
    this.hook.next({
      observable: this.observable,
      kind,
      tag: tag(this.observable),
      value,
    });
  }
  _next(value: T) {
    this.destination.next && this.destination.next(value);
    this.notifyHook(NotificationKind.Next, value);
  }
  _error(err: any) {
    this.destination.error && this.destination.error(err);
    this.notifyHook(NotificationKind.Error, err);
  }
  _complete() {
    this.destination.complete && this.destination.complete();
    this.notifyHook(NotificationKind.Complete);
  }

  unsubscribe() {
    super.unsubscribe();
    this.notifyHook(NotificationKind.Unsubscribe);
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
        ...args: any[]
      ): Subscription {
        let wrapper: any[];
        if (tag(this) !== subscribe_patched) {
          wrapper = [new Wrapper(this, subscriber, ...args)];
        } else wrapper = args;
        const sink = original.apply(this, wrapper) as Subscriber<T>;
        return sink;
      };
      return () => {
        proto.subscribe = original;
      };
    }).pipe(tagOperator(subscribe_patched), publish(), refCount());
  }
  return proto[subscribe_patched]!;
}
