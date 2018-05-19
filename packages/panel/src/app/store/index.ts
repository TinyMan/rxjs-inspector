import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
  ActionReducer,
} from '@ngrx/store';
import * as fromObservables from './observables';
import { getHistory, ObservableState, getStricky } from './observables';
import { List } from 'immutable';
import { Notif } from '@rxjs-inspector/core';

export interface State {
  observables: fromObservables.State;
}

export const reducers: ActionReducerMap<State> = {
  observables: fromObservables.reducer as ActionReducer<fromObservables.State>,
};

export const selectObservablesState = createFeatureSelector<
  fromObservables.State
>('observables');

export const selectAllObservables = createSelector(
  selectObservablesState,
  fromObservables.getAllObservables
);

export const selectObservableEntities = createSelector(
  selectObservablesState,
  fromObservables.selectObservableEntities
);

export const selectCurrentObservableId = createSelector(
  selectObservablesState,
  fromObservables.getSelectedObservableId
);

export const selectCurrentObservable = createSelector(
  selectObservableEntities,
  selectCurrentObservableId,
  (entities, id) => entities[id!]
);

export const selectHistory = createSelector(selectObservablesState, getHistory);

export const selectObservableHistory = (id: string) =>
  createSelector(selectHistory, history => history.get(id, List<Notif>()));

export const selectCurrentObservableHistory = createSelector(
  selectCurrentObservableId,
  selectHistory,
  (id, history) => history.get(id!, List<Notif>())
);

export const selectSourcesObservables = (id: string) =>
  createSelector(selectObservableEntities, ent => getSources(ent, id));

export const selectSticky = createSelector(selectObservablesState, getStricky);

function getSources(
  entities: { [id: string]: ObservableState },
  id: string
): ObservableState[] {
  if (id in entities) {
    let a: ObservableState[] = [];
    if (entities[id].source) {
      a = getSources(entities, entities[id].source!);
    }
    return a.concat([entities[id]]);
  }
  return [];
}
