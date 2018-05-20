import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { MarbleViewService } from '../services/marble-view.service';

@Directive({
  selector: '[rootSvg]',
})
export class RootSvgDirective implements OnDestroy {
  constructor(
    private el: ElementRef,
    private marbleViewService: MarbleViewService
  ) {
    this.marbleViewService.registerSvg(el.nativeElement);
  }

  ngOnDestroy() {
    this.marbleViewService.destroySvg();
  }
}
