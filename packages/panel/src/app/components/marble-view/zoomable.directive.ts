import { Directive, ElementRef, HostListener } from '@angular/core';
import { MarbleViewService } from './marble-view.service';

@Directive({
  selector: '[zoomable]',
})
export class ZoomableDirective {
  constructor(
    private el: ElementRef,
    private marbleViewService: MarbleViewService
  ) {}

  @HostListener('mousewheel', ['$event'])
  mouseWheel(e: MouseWheelEvent) {
    const mouseWheelZoomSpeed = 1 / 120;
    this.marbleViewService.zoom(e.wheelDelta * mouseWheelZoomSpeed * 0.8);
    return false;
  }
}
