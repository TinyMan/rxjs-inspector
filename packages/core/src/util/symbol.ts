export function setSymbol(symbol: symbol, value: any, obj: object) {
  (obj as any)[symbol] = value;
  return obj;
}
