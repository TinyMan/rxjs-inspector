import { ActionReducerMap } from '@ngrx/store';
import * as fromObservables from './observables';

export interface State {
  observables: fromObservables.ObservablesState;
}

export const reducers: ActionReducerMap<State> = {
  observables: fromObservables.reduce,
};
