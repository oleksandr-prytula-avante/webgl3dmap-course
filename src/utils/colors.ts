import { HSL, ILandscape, RGBA } from "@/interfaces/ILandscape";
import { ETerrainType } from '@/enums/ETerrainType';
import { ColorStep, ColorVariety, TotalDegrees, TotalPercentage, TotalRGB } from "@/constants/color";
import { HSLtoRGBviaCanvas } from "./pick";

export function getTerrainTypeFromRGBA(rgba: RGBA): ETerrainType | undefined {
  const [red, green, blue] = rgba;

  const TerrianTypes = {
    [ETerrainType.MOUNTAIN]: red === TotalRGB,
    [ETerrainType.PLAIN]: green === TotalRGB,
    [ETerrainType.WATER]: blue === TotalRGB,
  }

  if (
    TerrianTypes[ETerrainType.MOUNTAIN] &&
    TerrianTypes[ETerrainType.PLAIN] &&
    TerrianTypes[ETerrainType.WATER]) {
    return ETerrainType.SNOW;
  }

  if (TerrianTypes[ETerrainType.MOUNTAIN]) {
    return ETerrainType.MOUNTAIN;
  }

  if (TerrianTypes[ETerrainType.PLAIN]) {
    return ETerrainType.PLAIN;
  }

  if (TerrianTypes[ETerrainType.WATER]) {
    return ETerrainType.WATER;
  }
}

export function RGBAtoGreyscale(rgba: RGBA) {
  const [red, green, blue] = rgba;

  return  (red + green + blue) / 3;
}

export function HEXtoRGBA(hex: string, alpha = 1): RGBA {
  const matches = hex.match(/\w\w/g) as RegExpMatchArray;
  const [red, green, blue] = matches.map(x => parseInt(x, 16));

  return [red, green, blue, alpha];
}

export function HEXtoRGBAfrom0to1(hex: string, alpha = 1): RGBA {
  const [red, green, blue] = HEXtoRGBA(hex, alpha);

  return [red / TotalRGB, green / TotalRGB, blue / TotalRGB, alpha];
}

export function PercentageToHSL(percentage: number): HSL {
  const colorIndex = Math.floor(percentage * ColorVariety);
  const lightness = (percentage < 0.01 ? 1 : 0.5) * TotalPercentage;

  let hue = ColorStep * (colorIndex + percentage - (colorIndex * TotalPercentage) / ColorVariety);

  if (hue >= TotalDegrees) {
    hue = Math.ceil(hue) % TotalDegrees;
  }

  return [hue, TotalPercentage, lightness];
}

export function RGBAtoLandscape(rgba: RGBA): ILandscape {
  const greyscale = RGBAtoGreyscale(rgba);
  const hsl = RGBAtoHSL(rgba);
  const terrainType = getTerrainTypeFromRGBA(rgba);

  return {
    hsl,
    rgba,
    greyscale,
    terrainType,
  };
}

export function GreyscaleToLandscape(greyscale: number): ILandscape {
  return {
    greyscale,
  };
}

export function HSLtoLandscape(hsl: HSL): ILandscape {
  const rgba = HSLtoRGBviaCanvas(hsl); // HSLtoRGBA(hsl);
  const terrainType = getTerrainTypeFromRGBA(rgba);
  const greyscale = RGBAtoGreyscale(rgba);

  return {
    hsl,
    rgba,
    greyscale,
    terrainType,
  };
}

export function HSLtoRGBA(hsl: HSL): RGBA {
  const [h] = hsl;
  let [, s, l] = hsl;

  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [TotalRGB * f(0), TotalRGB * f(8), TotalRGB * f(4), 1];
}

export function RGBAtoHSL(rgba: RGBA): HSL {
  let [r, g, b] = rgba;

  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;

  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];

  return [h, s, l];
}
