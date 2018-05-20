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
            .skipUntil(
              n => !!n && this.marbleViewService.isInWindow(n.timestamp)
            )
            .takeWhile(
              n => !!n && this.marbleViewService.isInWindow(n.timestamp)
            )
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
  getMinX(list: List<Notif> | undefined) {
    return list
      ? this.marbleViewService.timeToPixel(list.last().timestamp) - 50
      : 0;
  }
  getMaxX(list: List<Notif> | undefined) {
    return list
      ? this.marbleViewService.timeToPixel(list.first().timestamp) + 50
      : 0;
  }

  public trackByIndex(i: number, v: any) {
    return i;
  }
}
