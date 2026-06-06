import { Component, OnInit, inject } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'guides-youtube-video',
    templateUrl: './youtube-video.component.html',
    styleUrls: ['./youtube-video.component.less']
})
export class YoutubeVideoComponent extends CustomMarkdownElement implements OnInit {
  private sanitizer = inject(DomSanitizer);


  link: SafeResourceUrl;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${this.args[0]}`);
  }

}
