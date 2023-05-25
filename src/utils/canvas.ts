import { ILandscape } from "@/interfaces/ILandscape";

export type DrawPixelCallback = (pixel: ILandscape) => string;

export function generateCanvasFromLandscapeMatrix(matrix : ILandscape[][], drawPixel: DrawPixelCallback, canvas?: HTMLCanvasElement): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement('canvas') as HTMLCanvasElement;
  }

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = matrix.length;
  canvas.height = matrix[0].length;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  matrix.forEach(function (pixelsRow, x): void {
    pixelsRow.forEach(function (pixel, y): void {
      context.fillStyle = drawPixel(pixel);
      context.fillRect(x, y, 1, 1);
    });
  });


  context.closePath();

  return canvas;
}

export function generateImageFromLandscapeMatrix(matrix : ILandscape[][], drawPixel: DrawPixelCallback): string {
  const canvas = generateCanvasFromLandscapeMatrix(matrix, drawPixel);
  const image = canvas.toDataURL('image/jpeg');

  canvas.remove();

  return image;
}

export function drawHSLColorPixel(pixel: ILandscape): string {
  const { hsl = []} = pixel;

  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

export function drawRGBAColorPixel(pixel: ILandscape): string {
  const { rgba = []} = pixel;

  return `rgba(${rgba.join(',')})`;
}

export function drawGreyscalePixel(pixel: ILandscape): string {
  const { greyscale = []} = pixel;

  return `rgba(${greyscale}, ${greyscale}, ${greyscale}, 1)`;
}

export function generateColorCanvasFromLandscapeMatrix(matrix : ILandscape[][], canvas?: HTMLCanvasElement): HTMLCanvasElement {
  return generateCanvasFromLandscapeMatrix(matrix, drawRGBAColorPixel, canvas);
}

export function generateGreyscaleCanvasFromLandscapeMatrix(matrix : ILandscape[][], canvas?: HTMLCanvasElement): HTMLCanvasElement {
  return generateCanvasFromLandscapeMatrix(matrix, drawGreyscalePixel, canvas);
}

export function generateColorImageFromLandscapeMatrix(matrix : ILandscape[][]): string {
  return generateImageFromLandscapeMatrix(matrix, drawRGBAColorPixel);
}

export function generateGreyscaleImageFromLandscapeMatrix(matrix : ILandscape[][]): string {
  return generateImageFromLandscapeMatrix(matrix, drawGreyscalePixel);
}

export function getImagesFromLandscapeMatrix(matrix : ILandscape[][]): [string, string] {
  const colorImage = generateColorImageFromLandscapeMatrix(matrix);
  const greyscaleImage = generateGreyscaleImageFromLandscapeMatrix(matrix);

  return [colorImage, greyscaleImage];
}
