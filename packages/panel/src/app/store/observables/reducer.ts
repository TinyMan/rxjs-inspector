import {
  ObservablesState,
  initialState,
  adapter,
  ObservableState,
} from './state';
import { reducer, on, Action } from 'ts-action';
import * as Actions from './action';
import { Notif } from '@rxjs-inspector/core';
import { Update } from '@ngrx/entity';

export type Reducer<T> = (state: T | undefined, action: Action<string>) => T;

export const reduce = reducer<ObservablesState>(
  [
    on(Actions.Notification, (state: ObservablesState, { payload }) => ({
      ...adapter.upsertOne(createUpdateStmt(payload), state),
      history: state.history.push(payload),
    })),
  ],
  initialState
) as Reducer<ObservablesState>;

export function createUpdateStmt(notif: Notif): Update<ObservableState> {
  const { id, tag, operatorName: operator, source, value } = notif;
  return {
    id,
    changes: {
      tag: tag as string,
      operator,
      source,
      value,
    },
  };
}
