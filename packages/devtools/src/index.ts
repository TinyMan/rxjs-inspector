import { InspectorDevtools } from './inspector-devtools';

export { ConnectionNames, EventType, EXTENSION_KEY } from './constants';
export {
  DevtoolsHook,
  MessageHandler,
  DevtoolsEvent,
  DevtoolsBatchEvent,
  DevtoolsNotifEvent,
} from './types';

export function createInspectorDevtools() {
  return new InspectorDevtools(window);
}
