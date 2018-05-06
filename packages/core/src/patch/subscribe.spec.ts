import { patch, Notif, NotificationKind } from './subscribe';
import { Observable, of, throwError, Subject, EMPTY } from 'rxjs';
import {
  map,
  bufferCount,
  finalize,
  catchError,
  tap,
  skip,
  filter,
} from 'rxjs/operators';
import { tag } from '../operators';
import { identify } from '../util';

describe('subscribe', () => {
  let proto: typeof Observable.prototype;
  beforeEach(() => {
    proto = Object.assign({}, Observable.prototype);
  });
  afterEach(() => {
    Observable.prototype = proto;
  });

  describe('patch subscribe', () => {
    it(`should return an observable that patch the subscribe method when it\'s subscribed to`, () => {
      const original = Object.assign({}, Observable.prototype);
      const result = patch(Observable.prototype);
      expect(patch(Observable.prototype)).toBe(result);
      expect(Observable.prototype.subscribe).toBe(original.subscribe);
      const sub = result.subscribe();
      const sub1 = result.subscribe();
      expect(Observable.prototype.subscribe).not.toBe(original.subscribe);
      sub1.unsubscribe();
      expect(Observable.prototype.subscribe).not.toBe(original.subscribe);
      sub.unsubscribe();
      expect(Observable.prototype.subscribe).toBe(original.subscribe);
    });

    it('should not break next', async () => {
      patch(Observable.prototype).subscribe();
      const obs = of(1, 2, 3);
      return await new Promise(resolve =>
        obs
          .pipe(
            bufferCount(3),
            map(values => expect(values).toEqual([1, 2, 3]))
          )
          .subscribe(() => resolve())
      );
    });
    it('should not break error', async () => {
      patch(Observable.prototype).subscribe();
      const error = new Error();
      return await new Promise(resolve =>
        throwError(error).subscribe({
          error: e => {
            expect(e).toBe(error);
            resolve();
          },
        })
      );
    });
    it('should not break complete', async () => {
      patch(Observable.prototype).subscribe();
      return await new Promise(resolve => {
        const s = new Subject();
        s.asObservable().subscribe({ complete: () => resolve() });
        s.complete();
      });
    });
    test('should notify on next', async () => {
      let obs: Observable<number>;
      const promise = new Promise(resolve => {
        patch(Observable.prototype)
          .pipe(filter(n => n.kind === 'N'))
          .subscribe((notif: Notif) => {
            expect(notif.kind).toBe('N');
            expect(notif.observable).toBe(obs);
            expect(notif.value).toBe(0);
            resolve();
          });
      });
      obs = of(0);
      obs.subscribe();
      return await promise;
    });

    test('should notify on error', async () => {
      let obs: Observable<number>;
      const error = new Error();
      const promise = new Promise(resolve => {
        patch(Observable.prototype)
          .pipe(filter(n => n.kind === 'E'))
          .subscribe((notif: Notif) => {
            expect(notif.kind).toBe('E');
            expect(notif.observable).toBe(obs);
            expect(notif.value).toBe(error);
            resolve();
          });
      });
      obs = throwError(error);
      obs.subscribe();
      return await promise;
    });
    test('should notify on complete', async () => {
      let obs: Observable<number>;
      const complete = jest.fn();
      const promise = new Promise(resolve => {
        patch(Observable.prototype)
          .pipe(filter(n => n.kind === 'C'))
          .subscribe(notif => {
            expect(notif.kind).toBe('C');
            expect(notif.observable).toBe(obs);
            expect(complete).toHaveBeenCalled();
            expect(notif.value).toBe(undefined);
            resolve();
          });
      });
      obs = of(0);
      obs.subscribe({ complete });
      return await promise;
    });
    test('should notify on subscribe', async () => {
      let obs: Observable<number>;
      const promise = new Promise(resolve => {
        patch(Observable.prototype)
          .pipe(filter(n => n.kind === 'S'))
          .subscribe(notif => {
            expect(notif.kind).toBe('S');
            expect(notif.observable).toBe(obs);
            expect(notif.value).toBe(undefined);
            resolve();
          });
      });
      obs = of(0);
      obs.subscribe();
      return await promise;
    });
    test('should notify on unsubscribe', async () => {
      let obs: Observable<number>;
      const promise = new Promise(resolve => {
        patch(Observable.prototype)
          .pipe(filter(n => n.kind === 'U'))
          .subscribe(notif => {
            expect(notif.kind).toBe('U');
            expect(notif.observable).toBe(obs);
            expect(notif.value).toBe(undefined);
            resolve();
          });
      });
      obs = of(0);
      const sub = obs.subscribe();
      sub.unsubscribe();
      return await promise;
    });

    test('should correctly report the tag', async () => {
      let obs: Observable<number>;
      const specialTag = 'special tag';
      const next = jest.fn();
      return await new Promise(resolve => {
        patch(Observable.prototype).subscribe(next);
        obs = of(0).pipe(tag(specialTag));
        obs.subscribe({
          complete() {
            setImmediate(() => {
              expect(next).toHaveBeenCalledTimes(4);
              expect(next).toHaveBeenCalledWith({
                observable: obs,
                tag: specialTag,
                kind: NotificationKind.Next,
                value: 0,
                id: identify(obs),
              } as Notif);
              expect(next).toHaveBeenCalledWith({
                observable: obs,
                tag: specialTag,
                kind: NotificationKind.Complete,
                id: identify(obs),
              } as Notif);
              expect(next).toHaveBeenCalledWith({
                observable: obs,
                tag: specialTag,
                kind: NotificationKind.Unsubscribe,
                id: identify(obs),
              } as Notif);
              expect(next).toHaveBeenCalledWith({
                observable: obs,
                tag: specialTag,
                kind: NotificationKind.Subscribe,
                id: identify(obs),
              } as Notif);
              resolve();
            });
          },
        });
      });
    });
  });
});
