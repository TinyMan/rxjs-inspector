import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DevtoolsService } from './services/devtools/devtools.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { ObservableState } from './store/observables';
import {
  selectCurrentObservable,
  selectCurrentObservableHistory,
  selectCurrentObservableValue,
} from './store';
import { List } from 'immutable';
import { Notif } from '@rxjs-inspector/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public value$: Observable<object | null>;
  constructor(private devtools: DevtoolsService, private store: Store<Action>) {
    this.value$ = this.store.select(selectCurrentObservableValue);
  }
  ngOnInit(): void {}
}
