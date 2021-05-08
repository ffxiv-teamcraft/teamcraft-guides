import { Component } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';

@Component({
  selector: 'guides-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.less']
})
export class ActionComponent extends CustomMarkdownElement {
}
