import { Notif } from '@rxjs-inspector/core';
import { Action } from '@ngrx/store';

export enum ActionsTypes {
  Notification = '[Devtools] Notification',
  Notification1 = '[Devtools] Notification1',
}
export class NotificationAction implements Action {
  readonly type = ActionsTypes.Notification;
  constructor(public readonly payload: Notif) {}
}
export class Notification1Action implements Action {
  readonly type = ActionsTypes.Notification1;
}

export type ObservableActionsUnion = NotificationAction | Notification1Action;
