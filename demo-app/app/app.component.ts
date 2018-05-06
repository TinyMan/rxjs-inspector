import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { tag } from '@rxjs-inspector/core/operators';

@Component({
  selector: 'app-root',
  template: `Rxjs inspector Demo app ! `,
  styles: [],
})
export class AppComponent {
  title = 'app';
  constructor() {
    const obs = interval(1000);

    obs
      .pipe(tag('time'), take(1), map(n => (n * 2) % 100))
      .subscribe(a => console.log(a));
  }
}
