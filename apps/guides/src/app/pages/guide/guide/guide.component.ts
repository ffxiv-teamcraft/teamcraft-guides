import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Guide } from '../../../database/+state/guide';
import { map, switchMapTo, tap } from 'rxjs/operators';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'guides-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less']
})
export class GuideComponent {

  guide$: Observable<Guide> = this.route.paramMap.pipe(
    map(params => params.get('slug')),
    tap((slug: string) => {
      this.guidesFacade.select(slug);
    }),
    switchMapTo(this.guidesFacade.selectedGuides$)
  );

  constructor(private guidesFacade: GuidesFacade,
              private route: ActivatedRoute) {
    this.guidesFacade.init();
  }

}
