import { EventType } from './constants';
import { Notif } from '@rxjs-inspector/core';

export type MessageHandler = (message: any) => void;

export interface DevtoolsHook {
  namespace: string;
}

export interface IDevtoolsEvent {
  readonly type: string;
}
export class DevtoolsNotifEvent implements IDevtoolsEvent {
  readonly type = EventType.NOTIF;
  constructor(public notif: Notif) {}
}
export class DevtoolsBatchEvent implements IDevtoolsEvent {
  readonly type = EventType.BATCH;
  constructor(public batch: DevtoolsEvent[]) {}
}
export class DevtoolsInitEvent implements IDevtoolsEvent {
  readonly type = EventType.INIT;
}
export type DevtoolsEvent =
  | DevtoolsNotifEvent
  | DevtoolsBatchEvent
  | DevtoolsInitEvent;
