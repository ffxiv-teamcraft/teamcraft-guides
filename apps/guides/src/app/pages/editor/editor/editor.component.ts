import { Component } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { ActivatedRoute } from '@angular/router';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Guide } from '../../../database/+state/model/guide';
import { GuideCategory } from '../../../database/+state/model/guide-category';
import { uniq } from 'lodash';

@Component({
  selector: 'guides-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent {

  selectedTab = 0;

  guide$: Observable<Guide> = this.route.paramMap.pipe(
    map(params => params.get('slug')),
    tap((slug: string) => {
      if (slug) {
        this.guidesFacade.select(slug);
      }
    }),
    switchMap(slug => {
      if (slug) {
        return this.guidesFacade.selectedGuides$.pipe(
          map(guide => ({ ...guide }))
        );
      }
      return of({
        author: '',
        slug: '',
        title: '',
        content: '',
        description: '',
        published: false
      } as Guide);
    }),
    filter(guide => !!guide),
    tap(guide => {
      if (guide.content) {
        this.selectedTab = 1;
      }
    })
  );

  availableCategories = uniq(Object.keys(GuideCategory));

  constructor(private nzConfigService: NzConfigService, private guidesFacade: GuidesFacade,
              private route: ActivatedRoute) {
    const defaultEditorOption = this.nzConfigService.getConfigForComponent('codeEditor')?.defaultEditorOption || {};
    this.nzConfigService.set('codeEditor', {
      defaultEditorOption: {
        ...defaultEditorOption,
        theme: 'vs-dark'
      }
    });
    this.guidesFacade.init();
  }

  save(guide: Guide): void {
    this.guidesFacade.save({ ...guide });
  }

  publish(guide: Guide): void {
    this.guidesFacade.save({
      ...guide,
      published: true
    });
  }

  updateGuideSlug(guide: Guide): void {
    if (!guide.content) {
      guide.slug = guide.title.toLowerCase().replace(/[^\w]+/gmi, '-').slice(0, 32);
    }
  }
}
