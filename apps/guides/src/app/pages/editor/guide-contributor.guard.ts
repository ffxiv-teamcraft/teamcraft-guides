import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { GuidesFacade } from '../../database/+state/guides.facade';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../../database/auth.service';


@Injectable()
export class GuideContributorGuard implements CanActivate {

  constructor(private guidesFacade: GuidesFacade, private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest([this.guidesFacade.allGuides$, this.auth.user$]).pipe(
      first(),
      map(([guides, user]) => {
        const guide = guides.find(g => g.slug === route.paramMap.get('slug'));
        if (!guide || !user) {
          return false;
        }
        return guide.author === user.$key || (guide.contributors || []).includes(user.$key);
      })
    );
  }

}
