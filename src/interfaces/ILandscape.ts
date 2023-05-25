import { ETerrainType } from "@/enums/ETerrainType";

export type HSL = [number, number, number];
export type RGBA = [number, number, number, number];

export interface ILandscape {
  hsl?: HSL;
  rgba?: RGBA;
  greyscale?: number;
  terrainType?: ETerrainType;
}
