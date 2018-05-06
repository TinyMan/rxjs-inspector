import {
  of,
  Observable,
  Notification,
  Subscription,
  PartialObserver,
  Subscriber,
  Operator,
} from 'rxjs';
import { share, refCount, publish } from 'rxjs/operators';
import { tag, identify } from '../util';
import { tag as tagOperator } from '../operators';
import { lift } from './lift';

export const subscribe_patched = 'dhfbksjhgfjdgfskjhfgskdhgsk'; // Symbol();

export const enum NotificationKind {
  Next = 'N',
  Error = 'E',
  Complete = 'C',
  Subscribe = 'S',
  Unsubscribe = 'U',
}
export interface Notif {
  observable?: Observable<any>;
  tag?: string | symbol;
  id: string;
  kind: NotificationKind;
  value?: any;
  source?: string;
  operatorName?: string;
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
      id: identify(this.observable),
      kind,
      tag: tag(this.observable),
      value,
      source: this.observable.source
        ? identify(this.observable.source)
        : undefined,
      operatorName: this.observable.operator
        ? this.observable.operator.constructor.name
        : undefined,
    });
  }
  _next(value: T) {
    this.notifyHook(NotificationKind.Next, value);
    this.destination.next && this.destination.next(value);
  }
  _error(err: any) {
    this.notifyHook(NotificationKind.Error, err);
    this.destination.error && this.destination.error(err);
  }
  _complete() {
    this.notifyHook(NotificationKind.Complete);
    this.destination.complete && this.destination.complete();
  }

  unsubscribe() {
    this.notifyHook(NotificationKind.Unsubscribe);
    super.unsubscribe();
  }
}

export function patch(
  proto: typeof Observable.prototype & {
    [subscribe_patched]?: Observable<Notif>;
  }
) {
  if (!proto.hasOwnProperty(subscribe_patched)) {
    lift(proto, { inheritTags: true });
    const original = proto.subscribe;
    proto[subscribe_patched] = new Observable<Notif>(subscriber => {
      let hidden = false;
      proto.subscribe = function subscribe<T>(
        this: Observable<T>,
        ...args: any[]
      ): Subscription {
        let wrapper: any[];
        if (!hidden && tag(this) !== subscribe_patched) {
          wrapper = [new Wrapper(this, subscriber, ...args)];
        } else {
          hidden = true;
          wrapper = args;
        }
        const sink = original.apply(this, wrapper) as Subscriber<T>;
        hidden = false;
        return sink;
      };
      return () => {
        proto.subscribe = original;
      };
    }).pipe(publish(), refCount(), tagOperator(subscribe_patched));
  }
  return proto[subscribe_patched]!;
}
