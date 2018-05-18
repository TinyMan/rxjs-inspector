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
import { interval, Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { selectObservableHistory } from '../../store';
import { START_TIME } from '../marble-view/marble-view.component';
import { Inject } from '@angular/core';

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
    @Inject(START_TIME) private startTime: number
  ) {}

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
  getLeft(notif: Notif) {
    return (notif.timestamp - this.startTime) / 1000 * 20;
  }
}
