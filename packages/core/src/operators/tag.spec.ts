import { Observable, from } from 'rxjs';
import { tag } from './tag';
import { tag as getTag } from '../util';
import { toArray } from 'rxjs/operators';

describe('tag operator', () => {
  it('should tag the input observable', () => {
    const obs = new Observable();

    obs.pipe(tag('test'));
    expect(getTag(obs)).toBe('test');
  });
  it('should do nothing else', () => {
    return from(['alice', 'bob'])
      .pipe(tag('people'), toArray())
      .toPromise()
      .then(value => expect(value).toEqual(['alice', 'bob']));
  });
});
