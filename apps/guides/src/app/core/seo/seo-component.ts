import { Meta, Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { SeoMetaConfig } from './seo-meta-config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class SeoComponent implements OnDestroy, OnInit {

  protected onDestroy$ = new Subject<void>();

  protected constructor(private meta: Meta, private title: Title) {
  }

  protected abstract getMeta$(): Observable<SeoMetaConfig>;

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.getMeta$().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(config => {
      this.title.setTitle(config.title);
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:image', content: config.banner });
      this.meta.updateTag({ property: 'og:title', content: config.title });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.meta.updateTag({ property: 'og:image', content: config.banner });
    });
  }
}
