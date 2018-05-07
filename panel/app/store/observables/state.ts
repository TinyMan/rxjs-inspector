import { Notif } from '@rxjs-inspector/core';
import { List } from 'immutable';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export interface ObservablesState extends EntityState<{}> {
  history: List<Notif>;
}

export const adapter = createEntityAdapter<{}>();
export const initialState: ObservablesState = adapter.getInitialState({
  history: List<Notif>(),
});
