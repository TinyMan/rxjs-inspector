import { Observable } from 'rxjs';
import { tag, setSymbol } from '../util';
const patched = Symbol('patched');

export function lift(
  observableProto: typeof Observable.prototype,
  { inheritTags = true }: { inheritTags?: boolean } = {}
) {
  // check if not already patched
  if (!observableProto.lift.hasOwnProperty(patched)) {
    const originalLift = observableProto.lift;
    observableProto.lift = function patchedLift<R>(
      ...args: any[]
    ): Observable<R> {
      const result = originalLift.call(this, ...args);
      if (inheritTags) tag(result, tag(this));
      return result;
    };
    setSymbol(patched, true, observableProto.lift);
    return () => {
      observableProto.lift = originalLift;
    };
  }
  return () => {};
}
