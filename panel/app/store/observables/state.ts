import { Notif } from '@rxjs-inspector/core';
import { List } from 'immutable';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export interface ObservableState {
  id: string;
  tag: string;
  source?: string;
  operator?: string;
  value?: any;
}

export interface ObservablesState extends EntityState<ObservableState> {
  history: List<Notif>;
}

export const adapter = createEntityAdapter<ObservableState>();
export const initialState: ObservablesState = adapter.getInitialState({
  history: List<Notif>(),
});
