import { v4 } from 'uuid';

export function download(image: string): void {
  const link = document.createElement('a');
  const name = `${v4()}.jpg`;

  link.download = name;
  link.href = image;
  link.click();
  link.remove();
}
