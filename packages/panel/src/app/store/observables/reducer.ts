import { Notif } from '@rxjs-inspector/core';
import { Update, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ObservableActionsUnion, ActionsTypes } from './action';
import { Map, List } from 'immutable';
import { createFeatureSelector } from '@ngrx/store';

export interface ObservableState {
  id: string;
  tag: string;
  source?: string;
  operator?: string;
  value?: any;
}

export interface State extends EntityState<ObservableState> {
  history: Map<string, List<Notif>>;
  selectedObservableId: string | null;
  historyMaxAge: number; // maximum age of events in the history
  historySize: number; // maximum number of events in the history
  sticky: boolean; // if the marble diagram is sticky to the flowing time
}

export const adapter = createEntityAdapter<ObservableState>();
export const initialState: State = adapter.getInitialState({
  history: Map<string, List<Notif>>(),
  selectedObservableId: null,
  historyMaxAge: 300000, // 300 seconds
  historySize: 200,
  sticky: true,
});

export function reducer(
  state = initialState,
  action: ObservableActionsUnion
): State {
  switch (action.type) {
    case ActionsTypes.Notification:
      const now = Date.now();
      const { id, tag, operatorName: operator, source, value } = action.payload;
      return {
        ...adapter.upsertOne(
          {
            id,
            tag: tag as string,
            operator,
            source,
            value,
          },
          state
        ),
        history: state.history.update(action.payload.id, list =>
          (!!list ? list.unshift(action.payload) : List([action.payload]))
            .take(state.historySize)
            .takeWhile(
              notif => !!notif && notif.timestamp > now - state.historyMaxAge
            )
            .toList()
        ),
      };
    case ActionsTypes.SelectObservable:
      return {
        ...state,
        selectedObservableId: action.payload,
      };
    case ActionsTypes.StickyUpdate:
      return {
        ...state,
        sticky: action.payload,
      };
    case ActionsTypes.Init:
      return {
        ...adapter.removeAll(state),
        history: state.history.clear(),
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

export const getHistory = (state: State) => state.history;
export const getStricky = (state: State) => state.sticky;
