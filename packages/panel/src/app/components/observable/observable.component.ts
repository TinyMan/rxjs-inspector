import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ObservableState } from '../../store/observables';
import { Input } from '@angular/core';
import { List } from 'immutable';
import { Notif, NotificationKind } from '@rxjs-inspector/core';
import { interval, Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map, share, shareReplay } from 'rxjs/operators';
import { Action, Store, select, createSelector } from '@ngrx/store';
import {
  selectObservableHistory,
  selectObservablesState,
  selectHighlightedNotif,
  isHighlightedNotif,
} from '../../store';
import { START_TIME } from '../marble-view/marble-view.component';
import { Inject } from '@angular/core';
import { MarbleViewService } from '../../services/marble-view.service';
import { NotifClickAction } from '../../store/observables/action';

@Component({
  selector: '[app-observable]',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableComponent implements OnChanges {
  @Input()
  observable!: ObservableState;

  public history$!: Observable<List<Notif>>;
  private destroy$ = new Subject();

  constructor(
    private store: Store<Action>,
    private marbleViewService: MarbleViewService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.observable && changes.observable.currentValue) {
      this.history$ = combineLatest(
        this.marbleViewService.notify$,
        this.store.select(selectObservableHistory(this.observable.id))
      ).pipe(
        map(([, history]) =>
          history
            .skipUntil(n => !!n && this.marbleViewService.isInWindow(n))
            .takeWhile(n => !!n && this.marbleViewService.isInWindow(n))
            .toList()
        ),
        shareReplay(1)
      );
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNext(notif: Notif) {
    return notif.kind === NotificationKind.Next;
  }
  isError(notif: Notif) {
    return notif.kind === NotificationKind.Error;
  }
  isComplete(notif: Notif) {
    return notif.kind === NotificationKind.Complete;
  }
  isUnsubscribe(notif: Notif) {
    return notif.kind === NotificationKind.Unsubscribe;
  }
  isSubscribe(notif: Notif) {
    return notif.kind === NotificationKind.Subscribe;
  }
  public trackByIndex(i: number, v: any) {
    return i;
  }

  notifClick(notif: Notif) {
    this.store.dispatch(new NotifClickAction(notif));
  }

  isHighlighted(notif: Notif): Observable<boolean> {
    return this.store.pipe(select(isHighlightedNotif(notif)));
  }
  isPrimitive(value: any) {
    return value !== Object(value);
  }
}
