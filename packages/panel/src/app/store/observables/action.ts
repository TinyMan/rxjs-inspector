import { Notif } from '@rxjs-inspector/core';
import { Action } from '@ngrx/store';

export enum ActionsTypes {
  Notification = '[Devtools] Notification',
  SelectObservable = '[Observable List] Select Observable',
  StickyUpdate = '[Marble Settings] Update Sticky Setting',
  Init = '[Devtools] Init event',
}
export class NotificationAction implements Action {
  readonly type = ActionsTypes.Notification;
  constructor(public readonly payload: Notif) {}
}
export class SelectObservableAction implements Action {
  readonly type = ActionsTypes.SelectObservable;
  constructor(public payload: string) {}
}
export class StickyUpdateAction implements Action {
  readonly type = ActionsTypes.StickyUpdate;
  constructor(public payload: boolean) {}
}
export class InitAction implements Action {
  readonly type = ActionsTypes.Init;
}

export type ObservableActionsUnion =
  | NotificationAction
  | SelectObservableAction
  | StickyUpdateAction
  | InitAction;
