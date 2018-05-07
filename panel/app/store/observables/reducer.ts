import { ObservablesState, initialState } from './state';
import { reducer, on, Action } from 'ts-action';
import * as Actions from './action';

export type Reducer<T> = (state: T | undefined, action: Action<string>) => T;

export const reduce = reducer<ObservablesState>(
  [
    on(Actions.Notification, (state: ObservablesState, { payload }) => ({
      ...state,
      history: state.history.push(payload),
    })),
  ],
  initialState
) as Reducer<ObservablesState>;
