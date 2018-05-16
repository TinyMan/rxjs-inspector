import { Notif } from '@rxjs-inspector/core';
import { Update, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ObservableActionsUnion, ActionsTypes } from './action';
import { List } from 'immutable';
import { createFeatureSelector } from '@ngrx/store';

export interface ObservableState {
  id: string;
  tag: string;
  source?: string;
  operator?: string;
  value?: any;
}

export interface State extends EntityState<ObservableState> {
  history: List<Notif>;
  selectedObservableId: string | null;
}

export const adapter = createEntityAdapter<ObservableState>();
export const initialState: State = adapter.getInitialState({
  history: List<Notif>(),
  selectedObservableId: null,
});

export function reducer(
  state = initialState,
  action: ObservableActionsUnion
): State {
  switch (action.type) {
    case ActionsTypes.Notification:
      return adapter.upsertOne(createUpdateStmt(action.payload), state);
    case ActionsTypes.SelectObservable:
      return {
        ...state,
        selectedObservableId: action.payload,
      };
    default:
      return state;
  }
}

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

export const {
  selectAll: getAllObservables,
  selectEntities: selectObservableEntities,
} = adapter.getSelectors();
export const getSelectedObservableId = (state: State) =>
  state.selectedObservableId;
