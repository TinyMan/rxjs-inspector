import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ObservableState } from '../../store/observables';
import { Input } from '@angular/core';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableComponent implements OnInit {
  @Input() observable!: ObservableState;
  constructor() {}

  ngOnInit() {}
}
