import { Component, OnInit, InjectionToken } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { Notif } from '@rxjs-inspector/core';
import { ObservableState } from '../../store/observables';
import {
  selectCurrentObservable,
  selectCurrentObservableHistory,
  selectSourcesObservables,
} from '../../store';
import { switchMap, filter } from 'rxjs/operators';

export function getTime() {
  return Date.now();
}
export const START_TIME = new InjectionToken<number>('Start time');

@Component({
  selector: 'app-marble-view',
  templateUrl: './marble-view.component.html',
  styles: [
    `:host {
    overflow: hidden;
    height: 100%;
  }
  .marble-view {

  }`,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: START_TIME, useFactory: getTime }],
})
export class MarbleViewComponent implements OnInit {
  selectedObservable$: Observable<ObservableState>;
  selectedObservableHistory$: Observable<List<Notif>>;
  previousObservables$: Observable<ObservableState[]>;
  constructor(private store: Store<Action>) {
    this.selectedObservable$ = this.store.select(selectCurrentObservable);
    this.selectedObservableHistory$ = this.store.select(
      selectCurrentObservableHistory
    );
    this.previousObservables$ = this.selectedObservable$.pipe(
      filter(obs => !!obs),
      switchMap(obs => this.store.select(selectSourcesObservables(obs.id)))
    );
  }
  ngOnInit() {}
  public trackById(i: number, e: { id: any }) {
    return e.id;
  }
}
