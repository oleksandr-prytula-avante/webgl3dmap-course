import { ILandscape, RGBA } from "@/interfaces/ILandscape";
import { RGBAtoLandscape } from "./colors";

export async function DataURLtoHTMLImageElement(dataURL: string | ArrayBuffer | null): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject): void {
    const image = new Image();

    image.onload = function(): void {
      resolve(image);
    }
    image.crossOrigin = 'anonymous';
    image.onerror = reject;
    image.src = dataURL as string;
  });
}

export async function convertBlobToImage(file: File): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject): void {
    const reader = new FileReader();

    reader.onload = async function(event: ProgressEvent<FileReader>): Promise<void> {
      const reader = event.target as FileReader;
      const image = await DataURLtoHTMLImageElement(reader.result);

      resolve(image);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getLandscapeMatrixFromImage(image: HTMLImageElement): Promise<ILandscape[][]> {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { width, height } = image;
  const matrix = new Array(width).fill(0).map(() => new Array(height).fill(0));

  context.canvas.width = width;
  context.canvas.height = height;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const position = (y * width + x) * 4;
      const red = pixels[position];
      const green = pixels[position + 1];
      const blue = pixels[position + 2];
      const alpha = pixels[position + 3] / 255;
      const rgba = [red, green, blue, alpha] as RGBA;
      const landscape = RGBAtoLandscape(rgba);

      matrix[x][y] = landscape;
    }
  }

  canvas.remove();

  return matrix;
}

export async function getLandscapeMatrixFromBlob(file: File): Promise<ILandscape[][]> {
  const image = await convertBlobToImage(file);

  const matrix = await getLandscapeMatrixFromImage(image);

  return matrix;
}
