import { lift } from './lift';
import { Observable } from 'rxjs';
import { tag } from '../util';
import { mapTo } from 'rxjs/operators';
import { tag as tagOperator } from '../operators';

describe('lift', () => {
  let proto: typeof Observable.prototype;
  beforeEach(() => {
    proto = Object.assign({}, Observable.prototype);
  });
  afterEach(() => {
    Observable.prototype = proto;
  });
  describe('patch lift', () => {
    it('should return a teardown function', () => {
      const original = Object.assign({}, Observable.prototype);
      const result = lift(Observable.prototype);
      expect(typeof result).toBe('function');
      result();
      expect(Observable.prototype).toEqual(original);
    });
    describe('option inheritTags', () => {
      it('should make lift copy source tag to resulting observable', () => {
        const obs = new Observable();
        const t = 'Tag value';
        tag(obs, t);

        lift(Observable.prototype, { inheritTags: true });
        const result = obs.lift(() => {});
        expect(tag(result)).toBe(t);
      });
      it('should not copy the tag if the option is set to false', () => {
        const obs = new Observable();
        const t = 'Tag value';
        tag(obs, t);

        lift(Observable.prototype, { inheritTags: false });
        const result = obs.lift(() => {});
        expect(tag(result)).not.toBe(t);
      });

      it('should work with pipe', () => {
        const obs = new Observable();
        const t = 'Tag value';
        lift(Observable.prototype, { inheritTags: true });
        const result = obs.pipe(tagOperator(t), mapTo('ok'));
        expect(tag(result)).toBe(t);
      });
    });
  });
});
