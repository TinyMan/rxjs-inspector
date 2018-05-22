export function parseStackTrace(stack: string) {
  const parsed = stack.split('\n');
  const matches = parsed[1].match(/at .+\(([^\)]+):(\d+):(\d+)\)$/);
  if (matches) {
    const [, file, line, col] = matches;
    return { file, line, col, stack: parsed };
  }

  return { file: '', line: 0, col: 0, stack: [] };
}
