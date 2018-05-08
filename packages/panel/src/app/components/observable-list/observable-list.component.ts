import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ObservableState, getAllObservables } from '../../store/observables';

@Component({
  selector: 'app-observable-list',
  templateUrl: './observable-list.component.html',
  styleUrls: ['./observable-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableListComponent implements OnInit {
  public observables$: Observable<ObservableState[]>;
  constructor(private store: Store<Action>) {
    this.observables$ = this.store.select(getAllObservables);
  }

  ngOnInit() {}
}
