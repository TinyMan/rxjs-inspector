import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  animationFrameScheduler,
  NEVER,
  combineLatest,
} from 'rxjs';
import {
  refCount,
  tap,
  publish,
  switchMap,
  filter,
  takeUntil,
} from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { selectSticky } from '../../store';

const animationFrame$ = interval(0, animationFrameScheduler).pipe(
  publish(),
  refCount()
);

@Injectable()
export class MarbleViewService {
  private _scale = 1;
  public get scale() {
    return this._scale;
  }
  public notify = new BehaviorSubject(null);
  public startTime = Date.now();

  private point?: SVGPoint;
  private svg?: SVGSVGElement;
  private svg$ = new BehaviorSubject<SVGSVGElement | undefined>(undefined);
  private viewBox?: SVGRect;
  private dragging = false;
  private pointerOrigin?: SVGPoint;

  constructor(private store: Store<Action>) {
    combineLatest(this.store.select(selectSticky), this.svg$)
      .pipe(
        switchMap(
          ([sticky, svg]) => (!sticky || !svg ? NEVER : animationFrame$)
        )
      )
      .subscribe(() => this.stick());
  }
  zoom(event: MouseWheelEvent) {
    const mouseWheelZoomSpeed = 1 / 120;
    const zoomFactor = event.wheelDelta * mouseWheelZoomSpeed * 0.8;
    const oldScale = this._scale;
    this._scale = Math.max(this._scale + zoomFactor, 1);
    if (this.viewBox) {
      const zoomOrigin = this.getPointFromEvent(event)!;
      this.viewBox.x -= zoomOrigin.x - zoomOrigin.x / oldScale * this._scale;
    }
    this.notify.next(null);
  }

  registerSvg(svg: SVGSVGElement) {
    this.svg = svg;
    this.point = this.svg.createSVGPoint();
    this.viewBox = this.svg.viewBox.baseVal;
    this.svg$.next(this.svg);
  }

  destroySvg() {
    this.svg = undefined;
    this.point = undefined;
    this.viewBox = undefined;
    this.svg$.next(undefined);
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.pointerOrigin = this.getPointFromEvent(event);
  }
  stopDrag() {
    this.dragging = false;
  }

  drag(event: MouseEvent | TouchEvent) {
    if (
      !this.dragging ||
      !this.svg ||
      !this.point ||
      !this.viewBox ||
      !this.pointerOrigin
    ) {
      return;
    }
    event.preventDefault();

    const pointerPosition = this.getPointFromEvent(event)!;

    this.viewBox.x -= pointerPosition.x - this.pointerOrigin.x;
    const temp = this.viewBox.y - (pointerPosition.y - this.pointerOrigin.y);
    this.viewBox.y = Math.min(0, temp);
  }

  getPointFromEvent(event: MouseEvent | TouchEvent): SVGPoint | undefined {
    if (!this.point || !this.svg) return;
    if (event instanceof TouchEvent) {
      this.point.x = event.targetTouches[0].clientX;
      this.point.y = event.targetTouches[0].clientY;
    } else {
      this.point.x = event.clientX;
      this.point.y = event.clientY;
    }

    const invertedSVGMatrix = this.svg.getScreenCTM().inverse();

    return this.point.matrixTransform(invertedSVGMatrix);
  }

  private stick() {
    if (!this.viewBox || this.dragging) return;
    this.viewBox.x = Math.round(this.getPointFromTime(Date.now()) - 940);
  }
  getPointFromTime(t: number) {
    return (t - this.startTime) / 1000 * 20 * this.scale;
  }
}
