import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MarbleViewService {
  private _scale = 1;
  public get scale() {
    return this._scale;
  }
  public notify = new BehaviorSubject(null);
  public startTime = Date.now();
  constructor() {}
  zoom(z: number) {
    this._scale = Math.max(this._scale + z, 1);
    this.notify.next(null);
  }
}
