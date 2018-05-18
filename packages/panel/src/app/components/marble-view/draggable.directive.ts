import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[draggable]',
})
export class DraggableDirective {
  private dragging = false;
  private svg: SVGSVGElement;
  private point: SVGPoint;
  private viewBox: SVGRect;
  private pointerOrigin: any;
  constructor(private el: ElementRef) {
    this.svg = el.nativeElement;
    this.point = this.svg.createSVGPoint();
    this.viewBox = this.svg.viewBox.baseVal;
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.pointerOrigin = this.getPointFromEvent(event);
  }
  @HostListener('mouseup')
  @HostListener('mouseleave')
  mouseUp() {
    this.dragging = false;
  }

  @HostListener('mousemove', ['$event'])
  mousemove(event: MouseEvent | TouchEvent) {
    if (!this.dragging) {
      return;
    }
    event.preventDefault();

    const pointerPosition = this.getPointFromEvent(event);

    this.viewBox.x -= pointerPosition.x - this.pointerOrigin.x;
    const temp = this.viewBox.y - (pointerPosition.y - this.pointerOrigin.y);
    this.viewBox.y = Math.min(0, temp);
  }

  getPointFromEvent(event: MouseEvent | TouchEvent) {
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
}
