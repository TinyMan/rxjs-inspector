import {
  Observable,
  Subscription,
  PartialObserver,
  Subscriber,
  ConnectableObservable,
} from 'rxjs';
import { publish } from 'rxjs/operators';
import { tag, identify, parseStackTrace } from '../util';
import { tag as tagOperator } from '../operators';
import { lift } from './lift';

export const subscribe_patched = Symbol('subscribe patch');

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
  observableId: string;
  id: number;
  kind: NotificationKind;
  value?: any;
  source?: string;
  operatorName?: string;
  timestamp: number;
  caller?: string;
  stackId: number;
  frameId: number;
}
let nextId = 0;
export class Wrapper<T> extends Subscriber<T> {
  static stack: string[] = [];
  static stackId = 0;
  constructor(
    private observable: Observable<T>,
    private hook: Subscriber<Notif>,
    destinationOrNext?: PartialObserver<any> | ((value: T) => void),
    error?: (e?: any) => void,
    complete?: () => void
  ) {
    super(...[destinationOrNext, error, complete].filter(e => !!e));
    this.notifyHook(NotificationKind.Subscribe);
  }

  private notifyHook(kind: NotificationKind, value?: any) {
    this.hook.next({
      observable: this.observable,
      observableId: identify(this.observable),
      id: nextId++,
      kind,
      tag: tag(this.observable),
      value,
      source: this.observable.source
        ? identify(this.observable.source)
        : undefined,
      operatorName: this.observable.operator
        ? this.observable.operator.constructor.name
        : undefined,
      timestamp: Date.now(),
      caller: Wrapper.stack[Wrapper.stack.length - 1],
      stackId: Wrapper.stackId,
      frameId: -1,
    });
  }
  private before() {
    if (Wrapper.stack.length === 0) Wrapper.stackId++;
    Wrapper.stack.push(identify(this.observable));
  }
  private after() {
    Wrapper.stack.pop();
  }

  _next(value: T) {
    this.notifyHook(NotificationKind.Next, value);
    this.before();
    this.destination.next && this.destination.next(value);
    this.after();
  }

  _error(err: any) {
    this.notifyHook(NotificationKind.Error, {
      error: err,
      parsedStack: parseStackTrace(err.stack),
    });
    this.before();
    this.destination.error && this.destination.error(err);
    this.after();
  }

  _complete() {
    this.notifyHook(NotificationKind.Complete);
    this.before();
    this.destination.complete && this.destination.complete();
    this.after();
  }

  unsubscribe() {
    this.notifyHook(NotificationKind.Unsubscribe);
    super.unsubscribe();
  }
}

export function patch(
  proto: typeof Observable.prototype & {
    [subscribe_patched]?: ConnectableObservable<Notif>;
  }
) {
  if (!proto.hasOwnProperty(subscribe_patched)) {
    lift(proto, { inheritTags: true });
    const original = proto.subscribe;
    proto[subscribe_patched] = new Observable<Notif>(subscriber => {
      let hidden = false;
      let taggedChain = false;
      proto.subscribe = function subscribe<T>(
        this: Observable<T>,
        ...args: any[]
      ): Subscription {
        let wrapper: any[];
        if (
          !hidden &&
          tag(this) !== subscribe_patched &&
          (!!tag(this) || taggedChain)
        ) {
          taggedChain = true;
          wrapper = [new Wrapper(this, subscriber, ...args)];
        } else {
          hidden = true;
          wrapper = args;
        }
        const sink = original.apply(this, wrapper) as Subscriber<T>;
        hidden = false;
        taggedChain = false;
        return sink;
      };
      return () => {
        proto.subscribe = original;
        console.log('unsubscribe');
      };
    }).pipe(
      publish(),
      tagOperator(subscribe_patched)
    ) as ConnectableObservable<Notif>;
  }
  proto[subscribe_patched]!.connect();
  return proto[subscribe_patched]!;
}
