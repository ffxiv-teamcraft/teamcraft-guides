import { Component, OnInit } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { combineLatest, Observable, of } from 'rxjs';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { map, switchMap } from 'rxjs/operators';
import { TeamcraftGearset } from '../../../database/gearset/teamcraft-gearset';
import { GearsetsService } from '../../../database/gearset/gearsets.service';
import { uniq } from 'lodash';
import { LazyDataService } from '../../lazy-data.service';

@Component({
  selector: 'guides-gearset',
  templateUrl: './gearset.component.html',
  styleUrls: ['./gearset.component.less']
})
export class GearsetComponent extends CustomMarkdownElement implements OnInit {

  gearset$: Observable<Partial<TeamcraftGearset>>;

  gearsetDisplay$: Observable<any>;

  slotNames = {
    'chest': 'Chest',
    'earRings': 'Ears',
    'feet': 'Feet',
    'ring1': 'Left finger',
    'ring2': 'Right finger',
    'gloves': 'Gloves',
    'head': 'Head',
    'legs': 'Legs',
    'mainHand': 'Main Hand',
    'necklace': 'Neck',
    'offHand': 'Off Hand',
    'crystal': 'Soul Crystal',
    'belt': 'Waist',
    'bracelet': 'Wrists'
  };

  gearsetSlotProperties: (keyof TeamcraftGearset)[][] = [
    ['mainHand', 'offHand'],
    ['head', 'earRings'],
    ['chest', 'necklace'],
    ['gloves', 'bracelet'],
    ['belt', 'ring1'],
    ['legs', 'ring2'],
    ['feet', 'crystal']
  ];

  emptySlotIcons = {
    mainHand: '&#xF081;',
    offHand: '&#xF082;',
    head: '&#xF083;',
    chest: '&#xF084;',
    gloves: '&#xF085;',
    belt: '&#xF086;',
    legs: '&#xF087;',
    feet: '&#xF088;',
    necklace: '&#xF090;',
    earRings: '&#xF089;',
    bracelet: '&#xF091;',
    ring1: '&#xF092;',
    ring2: '&#xF092;',
    crystal: '&#xF093;'
  };

  constructor(private gearsetsService: GearsetsService, private xivapiData: XivapiDataService,
              private lazyData: LazyDataService) {
    super();
  }

  ngOnInit(): void {
    this.gearset$ =
      this.gearsetsService.get(this.args[0]).pipe(
        map((gearset) => {
          if (!gearset.name) {
            return { notFound: true };
          }
          return gearset;
        })
      );
    this.gearsetDisplay$ = combineLatest([
      this.gearset$,
      this.lazyData.get('materias')
    ]).pipe(
      switchMap(([gearset, materias]) => {
        if (gearset.notFound) {
          return of(gearset);
        } else {
          const items: number[] = uniq([].concat.apply([], Object.values(gearset)
            .filter(v => v && !!v.itemId)
            .map(piece => [piece.itemId, ...piece.materias])));
          const materiasData = items
            .map(item => {
              return materias.find(materia => {
                return materia.itemId === item;
              });
            })
            .filter(m => !!m)
            .reduce((acc, materia) => {
              return {
                ...acc,
                [materia.itemId]: materia
              };
            }, {});
          return this.xivapiData.getItems(items).pipe(
            map(items => {
              return {
                gearset,
                items: items.reduce((acc, item) => ({ ...acc, [item.ID]: item }), {}),
                materias: materiasData
              };
            })
          );
        }
      })
    );
  }

}
