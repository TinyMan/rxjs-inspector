import { Component, OnInit } from '@angular/core';
import { DevtoolsService } from './services/devtools/devtools.service';
import { Observable, of } from 'rxjs';
import { ObservableRef } from '@rxjs-inspector/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  observableList$!: Observable<ObservableRef[]>;

  // @ts-ignore
  constructor(private devtools: DevtoolsService) {}
  ngOnInit(): void {
    this.observableList$ = of([{ tag: 'observable-1' }]).pipe(
      tap(o => o.forEach(e => console.log(e)))
    );
  }
}
