import { Component, OnDestroy } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { ActivatedRoute } from '@angular/router';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Guide } from '../../../database/+state/model/guide';
import { GuideCategory } from '../../../database/+state/model/guide-category';
import { uniq, uniqBy } from 'lodash';
import { NzCodeEditorComponent } from 'ng-zorro-antd/code-editor';
import { XivapiDataService } from '../../../core/xivapi/xivapi-data.service';
import { SearchIndex } from '@xivapi/angular-client';
import { Action } from '../../../core/xivapi/action';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImageUploadPopupComponent } from '../image-upload-popup/image-upload-popup.component';

@Component({
  selector: 'guides-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnDestroy {

  selectedTab = 0;

  showPreviewIneditor = false;

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

  actions$ = combineLatest([
    this.xivapi.getAllPages<Action>({
      indexes: [SearchIndex.CRAFT_ACTION],
      columns: ['Name_*', 'IconHD', 'ID'],
      filters: [{
        column: 'ClassJobTargetID',
        operator: '>',
        value: -1
      }]
    }),
    this.xivapi.getAllPages<Action>({
      indexes: [SearchIndex.ACTION],
      columns: ['Name_*', 'IconHD', 'ID'],
      filters: [{
        column: 'ClassJobTargetID',
        operator: '>=',
        value: 8
      },
        {
          column: 'ClassJobTargetID',
          operator: '<=',
          value: 18
        }]
    })
  ]).pipe(
    map(([actions, craftActions]) => {
      return uniqBy([...actions, ...craftActions], 'Name_en');
    }),
    shareReplay()
  );

  actionsFilter$ = new Subject<string>();

  actionsAutocomplete$ = combineLatest([this.actions$, this.actionsFilter$]).pipe(
    map(([actions, actionsFilter]) => {
      console.log(actions);
      return actions.filter(action => action.Name_en.includes(actionsFilter));
    })
  );

  selectedAction: number;

  availableCategories = uniq(Object.keys(GuideCategory));

  private onDestroy$ = new Subject<void>();

  constructor(private nzConfigService: NzConfigService, private guidesFacade: GuidesFacade,
              private route: ActivatedRoute, private xivapi: XivapiDataService,
              private modal: NzModalService) {
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

  reloadEditor(editor: NzCodeEditorComponent): void {
    editor.layout();
  }

  updateGuideSlug(guide: Guide): void {
    if (!guide.content) {
      guide.slug = guide.title.toLowerCase().replace(/[^\w]+/gmi, '-').slice(0, 32);
    }
  }

  addAction(guide: Guide): void {
    guide.content += `[Action:${this.selectedAction}]`;
    delete this.selectedAction;
  }

  addImages(guide: Guide): void {
    this.modal.create({
      nzTitle: 'Add images',
      nzContent: ImageUploadPopupComponent,
      nzFooter: null
    }).afterClose
      .subscribe((files: string[]) => {
        files.forEach(file => {
          guide.content += `\n\n![](${file})`;
        });
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
