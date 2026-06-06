import { Pipe, PipeTransform, inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Pipe({
    name: 'ifMobile',
    pure: false
})
export class IfMobilePipe implements PipeTransform {
  private media = inject(MediaObserver);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
  }

  transform<T, R>(nonMobileValue: T, mobileValue: R, forceMobile = false): T | R {
    return (forceMobile || this.media.isActive('xs') || this.media.isActive('sm')) ? mobileValue : nonMobileValue;
  }

}
