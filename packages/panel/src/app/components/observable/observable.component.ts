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
import { takeUntil, map } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { selectObservableHistory } from '../../store';
import { START_TIME } from '../marble-view/marble-view.component';
import { Inject } from '@angular/core';
import { MarbleViewService } from '../../services/marble-view.service';

@Component({
  selector: '[app-observable]',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableComponent implements OnChanges {
  @Input() observable!: ObservableState;

  public history$!: Observable<List<Notif>>;
  private destroy$ = new Subject();

  constructor(
    private store: Store<Action>,
    private marbleViewService: MarbleViewService,
    private _cdr: ChangeDetectorRef
  ) {
    this.marbleViewService.notify
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this._cdr.markForCheck());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.observable && changes.observable.currentValue) {
      this.history$ = this.store.select(
        selectObservableHistory(this.observable.id)
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
  getLeft(notif: Notif) {
    return Math.round(
      (notif.timestamp - this.marbleViewService.startTime) /
        1000 *
        20 *
        this.marbleViewService.scale
    );
  }
  getMinX(list: List<Notif> | undefined) {
    return list ? this.getLeft(list.last()) - 50 : 0;
  }
  getMaxX(list: List<Notif> | undefined) {
    return list ? this.getLeft(list.first()) + 50 : 0;
  }
}
