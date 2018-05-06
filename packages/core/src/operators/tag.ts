import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { tag as tagFn } from '../util';

export function tag<T>(tagValue: string | symbol): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    tagFn(source, tagValue);
    return source;
  };
}
