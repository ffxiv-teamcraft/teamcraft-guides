import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMapTo, tap } from 'rxjs/operators';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../database/auth.service';
import { Guide } from '../../../database/+state/model/guide';

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

  public isEditor$ = combineLatest([this.guide$, this.authService.user$]).pipe(
    map(([guide, user]) => user?.admin || user?.$key === guide.author)
  );

  constructor(private guidesFacade: GuidesFacade,
              private authService: AuthService,
              private route: ActivatedRoute) {
    this.guidesFacade.init();
  }

}
