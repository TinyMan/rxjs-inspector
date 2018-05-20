import { Directive, ElementRef, HostListener } from '@angular/core';
import { MarbleViewService } from '../services/marble-view.service';

@Directive({
  selector: '[draggable]',
})
export class DraggableDirective {
  constructor(
    private el: ElementRef,
    private marbleViewService: MarbleViewService
  ) {}

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent | TouchEvent) {
    this.marbleViewService.startDrag(event);
  }
  @HostListener('mouseup')
  @HostListener('mouseleave')
  mouseUp() {
    this.marbleViewService.stopDrag();
  }

  @HostListener('mousemove', ['$event'])
  mousemove(event: MouseEvent | TouchEvent) {
    this.marbleViewService.drag(event);
  }
}
