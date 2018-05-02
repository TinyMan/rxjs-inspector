import { setSymbol } from './symbol';

describe('symbol', () => {
  describe('set symbol', () => {
    it('should set a symbol on target object', () => {
      const s = Symbol();
      const obj: any = {};
      setSymbol(s, 'test value', obj);
      expect(obj[s]).toBe('test value');
    });
    it('should return the input object unchanged', () => {
      const s = Symbol();
      const obj: any = { prop1: 'ok' };
      const result = setSymbol(s, 'symbol value', obj);
      expect(result).toBe(obj);
      expect(Object.getOwnPropertyNames(obj)).toEqual(['prop1']);
      expect(obj.prop1).toBe('ok');
    });
  });
});
