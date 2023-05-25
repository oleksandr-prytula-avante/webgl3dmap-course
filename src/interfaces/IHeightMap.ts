import { ILandscape } from "./ILandscape";

export interface IHeightMap {
  id: string;
  colorImage: string;
  greyscaleImage: string;
  matrix: ILandscape[][];
}
