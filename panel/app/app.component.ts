import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DevtoolsService } from './services/devtools/devtools.service';
import { Observable, of } from 'rxjs';
import { ObservableRef } from '@rxjs-inspector/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private devtools: DevtoolsService) {}
  ngOnInit(): void {}
}
