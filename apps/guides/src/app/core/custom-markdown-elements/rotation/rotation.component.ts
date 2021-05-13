import { Component, OnInit } from '@angular/core';
import { RotationsService } from '../../../database/rotation/rotations.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TeamcraftRotation } from '../../../database/rotation/teamcraft-rotation';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { CraftingAction, CraftingActionsRegistry } from '@ffxiv-teamcraft/simulator';
import { Action } from '../../xivapi/action';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'guides-rotation',
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.less']
})
export class RotationComponent extends CustomMarkdownElement implements OnInit {

  rotation$: Observable<TeamcraftRotation | { notFound: true }>;
  rotationDisplay$: Observable<any>;

  constructor(private rotationsService: RotationsService, private xivapiData: XivapiDataService,
              private clipboardService: Clipboard, private message: NzMessageService) {
    super();
  }

  ngOnInit(): void {
    this.rotation$ = this.rotationsService.get(this.args[0]).pipe(
      map((rotation) => {
        if (!rotation.name) {
          return { notFound: true };
        }
        return rotation;
      })
    );
    this.rotationDisplay$ = this.rotation$.pipe(
      switchMap((rotation: TeamcraftRotation) => {
        if (rotation.notFound) {
          return of(rotation);
        }
        const deserialized = CraftingActionsRegistry.deserializeRotation(rotation.rotation);
        const actionIds = deserialized.map(action => action.getIds()[0]);
        return this.xivapiData.getActions(actionIds).pipe(
          map((actions) => {
            let link = `/simulator/${rotation.defaultItemId}/${rotation.defaultRecipeId}/${rotation.$key}`;
            if (rotation.custom || rotation.defaultItemId === undefined || rotation.defaultRecipeId === undefined) {
              link = `/simulator/custom/${rotation.$key}`;
            }
            return {
              ...rotation,
              actions: actionIds,
              macro: this.getMacro(deserialized, actions),
              link
            };
          })
        );
      })
    );
  }

  copyMacro(fragment: string): void {
    if (this.clipboardService.copy(fragment)) {
      this.message.success('Macros copied to your clipboard');
    } else {
      this.message.error('Failed to copy macros to your clipboard');
    }
  }

  private getMacro(rotation: CraftingAction[], actions: Action[]): string[] {
    const macro: string[][] = [[]];
    let totalLength = 0;
    let totalDuration = 0;
    let echoSeNumber = 0;
    rotation.forEach((action, actionIndex) => {
      let macroFragment = macro[macro.length - 1];
      // One macro is 15 lines, if this one is full, create another one.
      // Alternatively, if breaking before Byregots Blessing is enabled, split there too.
      let actionName = actions.find(a => a.ID === action.getIds()[0])?.Name_en;
      if (actionName.indexOf(' ') > -1) {
        actionName = `"${actionName}"`;
      }
      macroFragment.push(`/ac ${actionName} <wait.${action.getWaitDuration()}>`);
      totalDuration += action.getWaitDuration();
      totalLength++;

      const doneWithChunk = macroFragment.length === 14 && rotation.length > totalLength + 1;
      if (doneWithChunk) {
        let seNumber = Math.min(echoSeNumber - 1 + macro.length, 16);
        macroFragment.push(`/echo Macro #${macro.length} finished <se.${seNumber}>`);
        totalLength++;
      }
    });
    if (macro[macro.length - 1].length < 15) {
      let seNumber = Math.min(echoSeNumber + macro.length - 1, 16);
      macro[macro.length - 1].push(`/echo Craft finished <se.${seNumber}>`);
    }
    return macro.map(fragment => fragment.join('\n'));
  }

}
