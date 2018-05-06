const tagSymbol = Symbol('tag');

export function tag(
  obj: object,
  tagValue?: string | symbol
): string | symbol | undefined {
  const id = ((obj as any)[tagSymbol] = (obj as any)[tagSymbol] || tagValue);
  return id;
}
