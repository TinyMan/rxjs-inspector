import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
  ActionReducer,
} from '@ngrx/store';
import * as fromObservables from './observables';

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
