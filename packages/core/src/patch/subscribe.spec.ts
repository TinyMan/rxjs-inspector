import { subscribe, Notif } from './subscribe';
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
      const result = subscribe(Observable.prototype);
      expect(subscribe(Observable.prototype)).toBe(result);
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
      subscribe(Observable.prototype).subscribe();
      const obs = of(1, 2, 3);
      return await new Promise(resolve =>
        obs
          .pipe(
            bufferCount(3),
            map(values => expect(values).toEqual([1, 2, 3]))
          )
          .subscribe(resolve)
      );
    });
    it('should not break error', async () => {
      subscribe(Observable.prototype).subscribe();
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
      subscribe(Observable.prototype).subscribe();
      return await new Promise(resolve => {
        const s = new Subject();
        s.asObservable().subscribe({ complete: () => resolve() });
        s.complete();
      });
    });
    test('should notify on next', async () => {
      let obs: Observable<number>;
      const promise = new Promise(resolve => {
        subscribe(Observable.prototype).subscribe((notif: Notif) => {
          expect(notif.kind).toBe('N');
          expect(notif.observable).toBe(obs);
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
        subscribe(Observable.prototype).subscribe((notif: Notif) => {
          expect(notif.kind).toBe('E');
          expect(notif.observable).toBe(obs);
          resolve();
        });
      });
      obs = throwError(error);
      obs.subscribe();
      return await promise;
    });
    test('should notify on complete', async () => {
      let obs: Observable<number>;
      const promise = new Promise(resolve => {
        subscribe(Observable.prototype)
          .pipe(filter(n => n.kind === 'C'))
          .subscribe(notif => {
            expect(notif.kind).toBe('C');
            expect(notif.observable).toBe(obs);
            resolve();
          });
      });
      obs = of(0);
      obs.subscribe();
      return await promise;
    });
  });
});
