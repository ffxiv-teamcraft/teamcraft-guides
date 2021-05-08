import { Component } from '@angular/core';

@Component({
  selector: 'guides-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent {

  content = `I am using __Markdown__. *lmao*. Hey, what about this: [Action:100005]`;

  constructor() {
  }

}
