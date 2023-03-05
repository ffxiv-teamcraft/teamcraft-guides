import { Component, OnInit } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'guides-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.less']
})
export class YoutubeVideoComponent extends CustomMarkdownElement implements OnInit {

  link: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${this.args[0]}`);
  }

}
