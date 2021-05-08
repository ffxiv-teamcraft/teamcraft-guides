import { Component } from '@angular/core';

@Component({
  selector: 'guides-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less']
})
export class GuideComponent {

  testMarkdown = `I am using __Markdown__. *lmao*. Hey, what about this: [Action:100005]`;

}
