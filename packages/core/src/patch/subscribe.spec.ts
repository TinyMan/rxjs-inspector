import { patch, Notif, NotificationKind } from './subscribe';
import { Observable, of, throwError, Subject, EMPTY, pipe } from 'rxjs';
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
import { identify, tag as tagFn } from '../util';

describe('subscribe', () => {
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

  it('should not break next', () => {
    patch(Observable.prototype).subscribe();
    return new Promise(resolve => {
      const obs = of(1, 2, 3);
      obs
        .pipe(bufferCount(3), map(values => expect(values).toEqual([1, 2, 3])))
        .subscribe(() => resolve());
    });
  });
  it('should not break error', () => {
    return new Promise(resolve => {
      patch(Observable.prototype).subscribe();
      const error = new Error();
      throwError(error).subscribe({
        error: e => {
          expect(e).toBe(error);
          resolve();
        },
      });
    });
  });
  it('should not break complete', () => {
    return new Promise(resolve => {
      patch(Observable.prototype).subscribe();
      const s = new Subject();
      s.asObservable().subscribe({ complete: () => resolve() });
      s.complete();
    });
  });
  it('should notify on next', () => {
    return new Promise(resolve => {
      let obs: Observable<number>;
      const sub = patch(Observable.prototype)
        .pipe(filter(n => n.kind === 'N'))
        .subscribe((notif: Notif) => {
          expect(notif.kind).toBe('N');
          expect(notif.observable).toBe(obs);
          expect(notif.value).toBe(0);
          sub.unsubscribe();
          resolve();
        });

      obs = of(0);
      obs.subscribe();
    });
  });

  it('should notify on error', () => {
    return new Promise(resolve => {
      let obs: Observable<number>;
      const error = new Error();
      patch(Observable.prototype)
        .pipe(filter(n => n.kind === 'E'))
        .subscribe((notif: Notif) => {
          expect(notif.kind).toBe('E');
          expect(notif.observable).toBe(obs);
          expect(notif.value).toBe(error);
          resolve();
        });
      obs = throwError(error);
      obs.subscribe();
    });
  });
  it('should notify on complete', () => {
    return new Promise((resolve, reject) => {
      const complete = jest.fn();
      let obs: Observable<number>;
      patch(Observable.prototype)
        .pipe(filter(n => n.kind === 'C'))
        .subscribe(notif => {
          setImmediate(() => {
            try {
              expect(notif.kind).toBe('C');
              expect(notif.observable).toBe(obs);
              expect(complete).toHaveBeenCalled();
              expect(notif.value).toBe(undefined);
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        });
      obs = of(0);
      obs.subscribe({ complete });
    });
  });
  it('should notify on subscribe', () => {
    return new Promise(resolve => {
      let obs: Observable<number>;
      patch(Observable.prototype)
        .pipe(filter(n => n.kind === 'S'))
        .subscribe(notif => {
          expect(notif.kind).toBe('S');
          expect(notif.observable).toBe(obs);
          expect(notif.value).toBe(undefined);
          resolve();
        });
      obs = of(0);
      obs.subscribe();
    });
  });
  it('should notify on unsubscribe', () => {
    return new Promise(resolve => {
      let obs: Observable<number>;
      patch(Observable.prototype)
        .pipe(filter(n => n.kind === 'U'))
        .subscribe(notif => {
          expect(notif.kind).toBe('U');
          expect(notif.observable).toBe(obs);
          expect(notif.value).toBe(undefined);
          resolve();
        });
      obs = of(0);
      const sub = obs.subscribe();
      sub.unsubscribe();
    });
  });

  it('should correctly report the tag', () => {
    return new Promise(resolve => {
      let obs: Observable<number>;
      const specialTag = 'special tag';
      patch(Observable.prototype).subscribe(notif => {
        expect(notif.tag).toBe(specialTag);
        resolve();
      });
      obs = of(0).pipe(tag(specialTag));
      obs.subscribe();
    });
  });

  it('should report the source observable', () => {
    return new Promise(resolve => {
      const source = of(1);
      const obs = source.pipe(map(n => n * 2));
      const next = jest.fn();
      patch(Observable.prototype)
        .pipe(filter(n => n.kind === NotificationKind.Next))
        .subscribe(next);

      obs.subscribe({
        complete() {
          expect(next).toHaveBeenCalledTimes(2);
          expect(next.mock.calls[1][0].observable).toBe(obs);
          expect(next.mock.calls[0][0].observable).not.toBe(obs);
          expect(next.mock.calls[1][0].source).toBe(identify(source));
          expect(next.mock.calls[0][0].source).toBe(undefined);
          resolve();
        },
      });
    });
  });
});
