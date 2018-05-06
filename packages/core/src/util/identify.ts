import { setSymbol } from './symbol';

const idSymbol = Symbol('id');

let ids = 0;

export function identify(obj: object): string {
  if (!obj.hasOwnProperty(idSymbol)) {
    const id = ++ids;
    setSymbol(idSymbol, id, obj);
  }

  return (obj as { [idSymbol]: string })[idSymbol];
}
