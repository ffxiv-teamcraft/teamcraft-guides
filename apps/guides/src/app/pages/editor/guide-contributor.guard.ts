import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { GuidesFacade } from '../../database/+state/guides.facade';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../../database/auth.service';


@Injectable()
export class GuideContributorGuard  {
  private guidesFacade = inject(GuidesFacade);
  private auth = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest([this.guidesFacade.allGuides$, this.auth.user$]).pipe(
      first(),
      map(([guides, user]) => {
        const guide = guides.find(g => g.slug === route.paramMap.get('slug'));
        if (!guide || !user) {
          return false;
        }
        return user?.admin || user?.moderator || guide.author === user.$key || (guide.contributors || []).includes(user.$key);
      })
    );
  }

}
