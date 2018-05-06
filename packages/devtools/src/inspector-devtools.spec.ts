import { InspectorDevtools } from './inspector-devtools';

describe('InspectorDevtools', () => {
  it('should construct', () => {
    expect(() => new InspectorDevtools()).not.toThrow();
  });
});
