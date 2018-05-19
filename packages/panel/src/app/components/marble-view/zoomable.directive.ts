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
    this.marbleViewService.zoom(e);
    return false;
  }
}
