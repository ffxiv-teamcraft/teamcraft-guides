import { Component, OnInit, inject } from '@angular/core';
import { ListsService } from '../../../database/list/lists.service';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { TeamcraftList } from '../../../database/list/teamcraft-list';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'guides-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less'],
    imports: [ɵNzTransitionPatchDirective, NzIconDirective, FlexModule, ExtendedModule, NzSpaceCompactItemDirective, NzButtonComponent, NzDividerComponent, NzEmptyComponent, AsyncPipe]
})
export class ListComponent extends CustomMarkdownElement implements OnInit {
  private listsService = inject(ListsService);
  private xivapiData = inject(XivapiDataService);


  list$: Observable<Partial<TeamcraftList>>;

  listDisplay$: Observable<any>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.list$ = this.listsService.get(this.args[0]).pipe(
      map((list) => {
        if (!list.name) {
          return { notFound: true };
        }
        return list;
      })
    );
    this.listDisplay$ = this.list$.pipe(
      switchMap(list => {
        if (list.notFound) {
          return of(list);
        } else {
          return this.xivapiData.getItems(list.finalItems.map(item => item.id))
            .pipe(
              map(items => {
                return {
                  ...list,
                  finalItems: list.finalItems.map(item => {
                    return {
                      ...item,
                      ...(items.find(i => i.id === item.id) || {})
                    };
                  }),
                  importData: btoa(list.finalItems.map(i => `${i.id},${i.recipeId || 'null'},${i.amount}`).join(';'))
                };
              })
            );
        }
      })
    );
  }

}
