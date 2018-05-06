import { InspectorDevtools } from './inspector-devtools';

export * from './constants';
export * from './types';

export function createInspectorDevtools() {
  return new InspectorDevtools(window);
}
