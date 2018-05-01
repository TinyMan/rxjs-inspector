const tagSymbol = Symbol('tag');

export function tag(obj: object, tagValue?: string): string | undefined {
  const id = ((obj as any)[tagSymbol] = (obj as any)[tagSymbol] || tagValue);
  return id;
}
