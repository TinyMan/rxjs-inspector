import { Notif } from '@rxjs-inspector/core';
import { Action } from '@ngrx/store';

export enum ActionsTypes {
  Notification = '[Devtools] Notification',
  SelectObservable = '[Observable List] Select Observable',
}
export class NotificationAction implements Action {
  readonly type = ActionsTypes.Notification;
  constructor(public readonly payload: Notif) {}
}
export class SelectObservableAction implements Action {
  readonly type = ActionsTypes.SelectObservable;
  constructor(public payload: string) {}
}

export type ObservableActionsUnion =
  | NotificationAction
  | SelectObservableAction;
