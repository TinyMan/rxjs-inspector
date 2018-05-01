import { Observable } from 'rxjs';
import { tag } from './tag';

describe('tag', () => {
  it('should attach a tag', () => {
    const obs = new Observable();
    const t = 'test';
    expect(typeof tag(obs, t)).toBe('string');
    expect(tag(obs)).toBe(t);
  });
  it('should not do anything else', () => {
    const obj = {
      randomProp: 'ok',
    };
    tag(obj, 'tag');

    expect(Object.getOwnPropertyNames(obj)).toEqual(['randomProp']);
    expect(obj.randomProp).toEqual('ok');
  });
});
