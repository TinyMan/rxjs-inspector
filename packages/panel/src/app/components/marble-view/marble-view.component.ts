import { Component, OnInit, InjectionToken, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable, interval, Subject } from 'rxjs';
import { List } from 'immutable';
import { Notif } from '@rxjs-inspector/core';
import { ObservableState } from '../../store/observables';
import {
  selectCurrentObservable,
  selectCurrentObservableHistory,
  selectSourcesObservables,
} from '../../store';
import { switchMap, filter, share } from 'rxjs/operators';
import { MarbleViewService } from '../../services/marble-view.service';
import { StickyUpdateAction } from '../../store/observables/action';

export function getTime() {
  return Date.now();
}
export const START_TIME = new InjectionToken<number>('Start time');

@Component({
  selector: 'app-marble-view',
  templateUrl: './marble-view.component.html',
  styleUrls: ['./marble-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MarbleViewService],
})
export class MarbleViewComponent implements OnInit, OnDestroy {
  selectedObservable$: Observable<ObservableState>;
  selectedObservableHistory$: Observable<List<Notif>>;
  previousObservables$: Observable<ObservableState[]>;

  private destroy$ = new Subject();
  constructor(
    private store: Store<Action>,
    private marbleViewService: MarbleViewService
  ) {
    this.selectedObservable$ = this.store.select(selectCurrentObservable);
    this.selectedObservableHistory$ = this.store.select(
      selectCurrentObservableHistory
    );
    this.previousObservables$ = this.selectedObservable$.pipe(
      filter(obs => !!obs),
      switchMap(obs => this.store.select(selectSourcesObservables(obs.id))),
      share()
    );
  }

  public stickyChange(value: boolean) {
    this.store.dispatch(new StickyUpdateAction(value));
  }
  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public trackById(i: number, e: { id: any }) {
    return e.id;
  }
}
