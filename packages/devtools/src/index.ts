import { InspectorDevtools } from './inspector-devtools';

export * from './enums';
export * from './types';

export function createInspectorDevtools() {
  return new InspectorDevtools();
}
