import { InspectorDevtools } from './inspector-devtools';
import { Observable } from 'rxjs';
import { EXTENSION_KEY } from './constants';

describe('InspectorDevtools', () => {
  let proto: typeof Observable.prototype;
  beforeEach(() => {
    proto = Object.assign({}, Observable.prototype);
    Object.defineProperty(window, EXTENSION_KEY, {
      value: {
        namespace: 'test-namespace',
      },
      configurable: true,
    });
  });
  afterEach(() => {
    Object.assign(Observable.prototype, {}, proto);
    Object.defineProperty(window, EXTENSION_KEY, {
      value: undefined,
      configurable: true,
    });
  });
  it('should construct', () => {
    expect(() => new InspectorDevtools(window)).not.toThrow();
  });
  test('should send a init message to the extension', () => {
    const dispatchEvent = jest.fn();
    Object.defineProperty(window, 'dispatchEvent', {
      value: dispatchEvent,
    });
    new InspectorDevtools(window);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0][0].detail).toMatchSnapshot();
  });
});
