import { DataModel } from '../data-model';

export interface EquipmentPiece {
  itemId: number;
  hq: boolean;
  materias: number[];
  materiaSlots: number;
  canOvermeld: boolean;
  baseParamModifier: number;
}

export interface TeamcraftGearset extends DataModel {
  name: string;

  job: number;

  mainHand: EquipmentPiece;
  offHand: EquipmentPiece;

  head: EquipmentPiece;
  chest: EquipmentPiece;
  gloves: EquipmentPiece;
  belt: EquipmentPiece;
  legs: EquipmentPiece;
  feet: EquipmentPiece;

  necklace: EquipmentPiece;
  earRings: EquipmentPiece;
  bracelet: EquipmentPiece;
  ring1: EquipmentPiece;
  ring2: EquipmentPiece;

  crystal: EquipmentPiece;

  food: any;
}
