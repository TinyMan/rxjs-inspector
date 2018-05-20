import { Component } from '@angular/core';
import { interval, EMPTY, throwError } from 'rxjs';
import { map, take, switchMapTo, share } from 'rxjs/operators';
import { tag } from '@rxjs-inspector/core/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  intervalSource$ = interval(1000).pipe(share());
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
  constructor() {}
}
