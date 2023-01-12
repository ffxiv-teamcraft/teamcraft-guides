import { Component, HostListener, OnDestroy } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { ActivatedRoute } from '@angular/router';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Guide } from '../../../database/+state/model/guide';
import { GuideCategory } from '../../../database/+state/model/guide-category';
import { uniq, uniqBy } from 'lodash';
import { NzCodeEditorComponent } from 'ng-zorro-antd/code-editor';
import { XivapiDataService } from '../../../core/xivapi/xivapi-data.service';
import { SearchIndex } from '@xivapi/angular-client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImageUploadPopupComponent } from '../image-upload-popup/image-upload-popup.component';
import { TeamcraftUser } from '../../../database/user/teamcraft-user';
import { UsersService } from '../../../database/user/users.service';
import { AuthService } from '../../../database/auth.service';
import { XivAction } from '../../../core/xivapi/xiv-action';
import { LocationSelectionPopupComponent } from '../location-selection-popup/location-selection-popup.component';
import { GuideSubCategory } from '../../../database/+state/model/guide-sub-category';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { where } from '@angular/fire/firestore';

@Component({
  selector: 'guides-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnDestroy {

  selectedTab = 0;

  showPreviewInEditor = false;

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
        published: false,
        contributors: [],
        updated: Date.now()
      } as Guide);
    }),
    filter(guide => !!guide),
    tap(guide => {
      if (guide.content) {
        this.selectedTab = 1;
      }
    }),
    first()
  );

  actions$ = combineLatest([
    this.xivapi.getAllSearchPages<XivAction>({
      indexes: [SearchIndex.CRAFT_ACTION],
      columns: ['Name_*', 'IconHD', 'ID'],
      filters: [{
        column: 'ClassJobTargetID',
        operator: '>',
        value: -1
      }]
    }),
    this.xivapi.getAllSearchPages<XivAction>({
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
      return actions.filter(action => action.Name_en.includes(actionsFilter));
    })
  );

  otherEditors$: Observable<TeamcraftUser[]> = combineLatest([
    this.usersService.getAll(where('editor', '==', true)),
    this.guide$
  ]).pipe(
    map(([users, guide]) => {
      return users.filter(user => !(guide.contributors || []).includes(user.$key) && guide.author !== user.$key);
    })
  );

  selectedAction: number;

  selectedEditor: string;

  isContentUpdate = false;

  availableCategories = uniq(Object.keys(GuideCategory));

  public isAuthor$ = combineLatest([this.guide$, this.authService.user$]).pipe(
    map(([guide, user]) => {
      return user?.admin || user?.moderator || user?.$key === guide.author;
    })
  );

  private onDestroy$ = new Subject<void>();

  private subCategoriesCache: Partial<Record<GuideCategory, { label: string, value: string }[]>> = {};

  public editBanner = false;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public savingImage = false;

  public featuredGuides$ = this.guidesFacade.featuredGuides$;

  constructor(private nzConfigService: NzConfigService, public guidesFacade: GuidesFacade,
              private route: ActivatedRoute, private xivapi: XivapiDataService,
              private modal: NzModalService, private usersService: UsersService,
              private authService: AuthService, private storage: Storage,
              private message: NzMessageService) {
    const defaultEditorOption = this.nzConfigService.getConfigForComponent('codeEditor')?.defaultEditorOption || {};
    this.nzConfigService.set('codeEditor', {
      defaultEditorOption: {
        ...defaultEditorOption,
        theme: 'vs-dark'
      }
    });
    this.guidesFacade.init();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  setBanner(guide: Guide): void {
    this.savingImage = true;
    fetch(this.croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${guide.slug}-banner.png`, { type: 'image/png' });
        uploadBytes(ref(this.storage, `banners/${guide.slug}`), file).then((snap) => {
          getDownloadURL(snap.ref).then(url => {
            guide.banner = url;
            this.savingImage = false;
            this.editBanner = false;
            this.save(guide);
          });
        });
      });
  }

  removeFeatured(guide: Guide): void {
    this.save({ ...guide, featured: false });
  }

  removeContributor(guide: Guide, contributor: string): void {
    guide.contributors = guide.contributors.filter(c => c !== contributor);
    this.save({ ...guide, contributors: guide.contributors.filter(c => c !== contributor) });
  }

  save(guide: Guide): void {
    if (!guide.publishDate && guide.published) {
      guide.publishDate = Date.now();
    }
    if (this.isContentUpdate) {
      guide.updated = Date.now();
    }
    this.guidesFacade.save({ ...guide });
  }

  publish(guide: Guide): void {
    this.guidesFacade.save({
      ...guide,
      published: true,
      publishDate: Date.now()
    });
  }

  reloadEditor(editor: NzCodeEditorComponent): void {
    editor.layout();
  }

  updateGuideSlug(guide: Guide): void {
    if (!guide.content) {
      guide.slug = guide.title.toLowerCase().replace(/[^\w]+/gmi, '-').slice(0, 32);
      this.guidesFacade.dirty = true;
    }
  }

  getSubCategories(guide: Guide): { value: string, label: string }[] {
    if (this.subCategoriesCache[guide.category] === undefined) {
      this.subCategoriesCache[guide.category] = uniq(Object.keys(GuideSubCategory))
        .filter(key => {
          return key.startsWith(guide.category) || key === '_Other';
        })
        .map(key => {
          return {
            value: key,
            label: key.split('_')[1]
          };
        });
    }
    return this.subCategoriesCache[guide.category];
  }

  insertText(editor: NzCodeEditorComponent, text: string): void {
    editor['editorInstance'].trigger('keyboard', 'type', { text });
    this.guidesFacade.dirty = true;
  }

  addAction(editor: NzCodeEditorComponent): void {
    this.insertText(editor, `[Action:${this.selectedAction}]`);
    delete this.selectedAction;
  }

  addLocation(editor: NzCodeEditorComponent): void {
    this.modal.create({
      nzTitle: 'Add location',
      nzContent: LocationSelectionPopupComponent,
      nzWidth: '570px',
      nzFooter: null
    }).afterClose
      .subscribe(result => {
        if (result) {
          this.insertText(editor, result);
        }
      });
  }

  addContributor(guide: Guide): void {
    guide.contributors = [
      ...(guide.contributors || []),
      this.selectedEditor
    ];
    delete this.selectedEditor;
    this.message.success('Contributor added to the guide');
  }

  addImages(editor: NzCodeEditorComponent): void {
    this.modal.create({
      nzTitle: 'Add images',
      nzContent: ImageUploadPopupComponent,
      nzFooter: null
    }).afterClose
      .subscribe((files: string[]) => {
        files.forEach(file => {
          this.insertText(editor, `\n\n![](${file})`);
        });
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: Event): void {
    if (this.guidesFacade.dirty) {
      $event.returnValue = true;
    }
  }
}
