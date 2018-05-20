import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { MarbleViewService } from '../services/marble-view.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attribute } from '@angular/core';

@Directive({
  selector: '[sticky]',
})
export class StickyDirective implements OnDestroy {
  destroy$ = new Subject();
  private translate?: SVGTransform;
  private xMult = 1;
  private yMult = 1;
  constructor(
    private el: ElementRef,
    private marbleViewService: MarbleViewService,
    @Attribute('sticky') only: string
  ) {
    if (only === 'y') this.xMult = 0;
    else if (only === 'x') this.yMult = 0;
    let transform = (this.el.nativeElement as SVGGElement).transform.baseVal;
    this.marbleViewService.translate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translation => {
        if (!this.translate) {
          if (!this.marbleViewService.svg) return;
          this.translate = this.marbleViewService.svg.createSVGTransform();
          transform.appendItem(this.translate);
        }
        this.translate.setTranslate(
          -translation.x * this.xMult,
          -translation.y * this.yMult
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
