import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DevtoolsService } from './services/devtools/devtools.service';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { selectDisplayedValue } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public value$: Observable<any>;
  constructor(private devtools: DevtoolsService, private store: Store<Action>) {
    this.value$ = this.store.pipe(select(selectDisplayedValue));
  }
  ngOnInit(): void {}
}
