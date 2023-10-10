import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../database/list/lists.service';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { TeamcraftList } from '../../../database/list/teamcraft-list';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';

@Component({
  selector: 'guides-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends CustomMarkdownElement implements OnInit {

  list$: Observable<Partial<TeamcraftList>>;

  listDisplay$: Observable<any>;

  constructor(private listsService: ListsService, private xivapiData: XivapiDataService) {
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
