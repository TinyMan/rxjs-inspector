import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { MarbleViewService } from '../services/marble-view.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[sticky]',
})
export class StickyDirective implements OnDestroy {
  destroy$ = new Subject();
  private translate?: SVGTransform;
  constructor(
    private el: ElementRef,
    private marbleViewService: MarbleViewService
  ) {
    let transform = (this.el.nativeElement as SVGGElement).transform.baseVal;
    this.marbleViewService.translate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translation => {
        if (!this.translate) {
          this.translate = this.marbleViewService.svg!.createSVGTransform();
          transform.appendItem(this.translate);
        }
        this.translate.setTranslate(-translation.x, -translation.y);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
