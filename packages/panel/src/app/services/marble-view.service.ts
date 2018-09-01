import { Injectable, NgZone } from '@angular/core';
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
  withLatestFrom,
  takeWhile,
} from 'rxjs/operators';
import { Action, Store, select } from '@ngrx/store';
import {
  selectSticky,
  selectMaxFrameId,
  selectCurrentObservableHistory,
} from '../store';
import { StickyUpdateAction } from '../store/observables/action';
import { Notif } from '@rxjs-inspector/core';

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
  public notify$ = new BehaviorSubject(null);
  public startFrame = 0;
  public pixelPerEvent = 20;
  public windowWidth = 1000;

  private point?: SVGPoint;
  public svg?: SVGSVGElement;
  private svg$ = new BehaviorSubject<SVGSVGElement | undefined>(undefined);
  private _translate = { x: 0, y: 0 };
  private dragging = false;
  private pointerOrigin?: SVGPoint;

  public translate$ = new BehaviorSubject(this._translate);
  constructor(private store: Store<Action>, private ngZone: NgZone) {
    combineLatest(
      this.store
        .select(selectSticky)
        .pipe(tap(sticky => sticky && setTimeout(() => this.notify()))), // we need the notify to run AFTER the stick
      this.svg$
    )
      .pipe(
        switchMap(
          ([sticky, svg]) =>
            !sticky || !svg
              ? NEVER
              : animationFrame$.pipe(
                  withLatestFrom(this.store.pipe(select(selectMaxFrameId)))
                )
        )
      )
      .subscribe(([, maxFrame]) => this.stick(maxFrame));
  }
  public notify() {
    this.notify$.next(null);
  }
  zoom(event: MouseWheelEvent) {
    const mouseWheelZoomSpeed = 1 / 120;
    const zoomFactor = event.wheelDelta * mouseWheelZoomSpeed * 0.3;
    const oldScale = this._scale;
    this._scale = Math.max(this._scale + zoomFactor * this._scale, 1);
    if (this.svg) {
      const zoomOrigin = this.getPointFromEvent(event)!;
      /*
      console.log(
        'Zoom origin',
        // point where the mouse is
        zoomOrigin.x,
        'Zoom origin in svg coordinates',
        // the svg point corresponding
        zoomOrigin.x - this._translate.x,
        'New point in svg coordinates',
        // the new point after applying the new scale
        (zoomOrigin.x - this._translate.x) / oldScale * this.scale,
        'diff',
        // the difference between the old and the new point (svg coordinates)
        (zoomOrigin.x - this._translate.x) / oldScale * this.scale -
          (zoomOrigin.x - this._translate.x),
        'new translate',
        // the new translate with the difference applied
        this._translate.x -
          ((zoomOrigin.x - this._translate.x) / oldScale * this.scale -
            (zoomOrigin.x - this._translate.x))
      );*/

      this.setTranslate({
        x:
          this._translate.x -
          (((zoomOrigin.x - this._translate.x) / oldScale) * this.scale -
            (zoomOrigin.x - this._translate.x)),
      });
    }
    this.notify();
  }

  registerSvg(svg: SVGSVGElement) {
    this.svg = svg;
    this.point = this.svg.createSVGPoint();
    this.svg$.next(this.svg);
  }

  destroySvg() {
    this.svg = undefined;
    this.point = undefined;
    this.setTranslate({ x: 0, y: 0 });
    this.svg$.next(undefined);
  }

  startDrag(event: MouseEvent | TouchEvent) {
    // user wants to control the view by hand
    this.store.dispatch(new StickyUpdateAction(false));
    this.dragging = true;
    this.pointerOrigin = this.getPointFromEvent(event);
  }
  stopDrag() {
    this.dragging = false;
  }

  drag(event: MouseEvent | TouchEvent) {
    if (!this.dragging || !this.svg || !this.point || !this.pointerOrigin) {
      return;
    }
    event.preventDefault();

    const p = this.getPointFromEvent(event)!;

    this.setTranslate({
      x: this._translate.x + (p.x - this.pointerOrigin.x),
      y: Math.max(0, this._translate.y + (p.y - this.pointerOrigin.y)),
    });
    this.pointerOrigin = p;
    this.notify();
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

    const invertedSVGMatrix = this.svg.getScreenCTM()!.inverse();

    return this.point.matrixTransform(invertedSVGMatrix);
  }

  private stick(maxFrame: number) {
    if (!this.svg || this.dragging) return;
    const newX =
      this.frameToPixel(maxFrame) - this.windowWidth + 2 * this.pixelPerEvent; // Math.round(this.getPointFromTime(Date.now()) - 940);
    this.setTranslate({ x: -newX });
  }

  private getPointFromFrame(f: number) {
    return (f - this.startFrame) * this.pixelPerEvent * this.scale;
  }

  private setTranslate({ x = this._translate.x, y = this._translate.y } = {}) {
    if (this.svg) {
      this._translate = { x, y };
      this.translate$.next(this._translate);
      (this.svg.firstChild as SVGGElement).setAttribute(
        'transform',
        'translate(' + this._translate.x + ' ' + this._translate.y + ')'
      );
    }
  }
  public isInWindow(n: Notif) {
    const p = this.notifToPixel(n) + this.pixelPerEvent;
    return p > -this._translate.x && p < -this._translate.x + this.windowWidth;
  }

  public notifToPixel(n: Notif) {
    return this.frameToPixel(n.stackId || 0);
  }
  public frameToPixel(f: number) {
    return Math.round(this.getPointFromFrame(f));
  }
}
