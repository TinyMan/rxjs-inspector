import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DevtoolsService } from './services/devtools/devtools.service';
import { Observable, of } from 'rxjs';
import { ObservableRef } from '@rxjs-inspector/core';
import { tap } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { ObservableState } from './store/observables';
import { selectCurrentObservable } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  selectedObservable$: Observable<ObservableState>;
  constructor(private devtools: DevtoolsService, private store: Store<Action>) {
    this.selectedObservable$ = this.store.select(selectCurrentObservable);
  }
  ngOnInit(): void {}
}
