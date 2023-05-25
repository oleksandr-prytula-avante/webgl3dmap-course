import { HSL, RGBA } from "@/interfaces/ILandscape";
import { drawHSLColorPixel } from "./canvas";

const canvas = document.createElement('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

export function HSLtoRGBviaCanvas(hsl: HSL): RGBA {
  canvas.width = canvas.height = 1;

  context.fillStyle = drawHSLColorPixel({ hsl });
  context.fillRect(0, 0, 1, 1);

  const { data } = context.getImageData(0, 0, 1, 1);
  const red = data[0];
  const green = data[1];
  const blue = data[2];
  const alpha = data[3] / 255;
  const rgba = [red, green, blue, alpha] as RGBA;

  return rgba;
}
