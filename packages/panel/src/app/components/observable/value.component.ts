import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: '[app-value]',
  template: `<svg:text>{{ value }}</svg:text>`,
  styles: [
    `
  :host {
    border: 1px solid black;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
  }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueComponent implements OnInit {
  @Input() value!: any;
  constructor() {}

  ngOnInit() {}
}
