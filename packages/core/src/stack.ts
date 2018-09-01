import { Observable } from 'rxjs';
import { setSymbol } from './util';
const stackSymbol = Symbol('stack');

export class Stack extends Array<string> {
  private constructor(public id = 0) {
    super();
  }
  static create(id = 0): Stack {
    const stack = Object.create(Stack.prototype);
    stack.id = id;
    return stack;
  }
  public getNext() {
    return Stack.create(this.id + 1);
  }
}
export function getStack<T>(
  obs: Observable<T> & { [stackSymbol]?: Stack }
): Stack | undefined {
  return obs[stackSymbol];
}
export function setStack<T>(
  obs: Observable<T> & { [stackSymbol]?: Stack },
  stack: Stack
): Stack {
  setSymbol(stackSymbol, stack, obs);
  return stack;
}
