import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-observable-list',
  templateUrl: './observable-list.component.html',
  styleUrls: ['./observable-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
