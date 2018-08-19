import { Component } from '@angular/core';
import { tag } from '@rxjs-inspector/core';
import { interval } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Parent } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  intervalSource$ = interval(1000);
  interval1$ = this.intervalSource$.pipe(
    map(n => (n * 2) % 100),
    tag('interval 1')
  );
  take1$ = this.intervalSource$.pipe(take(10), tag('take 1'));
  error1$ = this.intervalSource$.pipe(
    take(1),
    map(i => {
      throw new Error(i.toString());
    }),
    tag('error1')
  );

  flattening1$ = this.intervalSource$.pipe(
    filter(i => i % 5 === 0),
    switchMap(i =>
      interval(500).pipe(
        map(a => a * 2),
        tag('flattening 1: inner' + i)
      )
    ),
    tag('flattening 1')
  );

  json$ = this.intervalSource$.pipe(
    map(i => new Parent()),
    tag('complexe json')
  );
  constructor() {}
}
