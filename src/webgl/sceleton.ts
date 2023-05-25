import * as twgl from 'twgl.js';

import { TotalRGB } from '@/constants/color';
import { IHeightMap } from "@/interfaces/IHeightMap";
import { RGBA } from "@/interfaces/ILandscape";

import { draw } from './base/draw';
import { init } from './base/init';
import { sphere as calculateSphere } from './base/primitives/sphere';
import { IPoint } from '@/interfaces/IPrimitive';
import { PIdeg } from '@/constants/WEGBL';

const { m4 } = twgl;

export async function scene(canvas: HTMLCanvasElement, heightMap: IHeightMap, fieldOfViewRadians: number, colors: Record<string, RGBA>, rotation: IPoint = [0, 0, 0], translation: IPoint = [0, 0, 1]): Promise<void> {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;
  const { primary, secondary } = colors;
  const { matrix } = heightMap;
  const width = matrix.length - 1;
  const depth = matrix[0].length - 1;
  const height = width / 6;
  const projection = m4.perspective(
    fieldOfViewRadians * Math.PI / 180,   // field of view
    canvas.clientWidth / canvas.clientHeight, // aspect
    1,  // near
    width * 2,  // far
  );
  const cameraPosition = [-width, height * 2, -depth];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const camera = m4.lookAt(cameraPosition, target, up);
  const view = m4.inverse(camera);

  let mat = m4.multiply(projection, view);

  mat = m4.translate(mat, translation);
  mat = m4.rotateX(mat, rotation[0] * Math.PI / PIdeg);
  mat = m4.rotateY(mat, rotation[1] * Math.PI / PIdeg);
  mat = m4.rotateZ(mat, rotation[2] * Math.PI / PIdeg);

  const points: number[] = [];
  const indexes: number[] = [];
  const rowStride = width + 1;

  for (let z = 0; z <= depth; ++z) {
    for (let x = 0; x <= width; ++x) {
      const point = matrix[x][z];
      const { greyscale } = point;
      const y = Number(greyscale) * height / TotalRGB;

      points.push(x - width / 2, y, z - depth / 2);
    }
  }

  // x lines
  for (let z = 0; z <= depth; ++z) {
    const rowOff = z * rowStride;

    for (let x = 0; x < width; ++x) {
      indexes.push(rowOff + x, rowOff + x + 1);
    }
  }

  // z lines
  for (let x = 0; x <= width; ++x) {
    for (let z = 0; z < depth; ++z) {
      const rowOff = z * rowStride;

      indexes.push(rowOff + x, rowOff + x + rowStride);
    }
  }

  const sphere = calculateSphere(Math.min(width / 10, 1), PIdeg, PIdeg, [0, 0, 0]);

  init(canvas);
  draw(canvas, gl.TRIANGLES, sphere.points, sphere.indexes, mat, secondary);
  draw(canvas, gl.LINES, points, indexes, mat, primary);
}
