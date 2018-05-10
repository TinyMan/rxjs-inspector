import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ObservableState, getAllObservables } from '../../store/observables';
import { share, map } from 'rxjs/operators';

@Component({
  selector: 'app-observable-list',
  templateUrl: './observable-list.component.html',
  styleUrls: ['./observable-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableListComponent implements OnInit {
  public observables$: Observable<ObservableState[]>;
  constructor(private store: Store<Action>) {
    this.observables$ = this.store
      .select(getAllObservables)
      .pipe(map(a => a.filter(e => e.tag && e.tag.length > 0)), share());
  }

  ngOnInit() {}
  public trackById(i: number, e: { id: any }) {
    return e.id;
  }
}
