import * as twgl from 'twgl.js';

import { TotalDegrees, TotalRGB } from '@/constants/color';
import { IHeightMap } from "@/interfaces/IHeightMap";
import { RGBA } from "@/interfaces/ILandscape";
import { IPoint } from '@/interfaces/IPrimitive';
import { PIdeg } from '@/constants/WEGBL';

import { draw } from './draw';

const { m4 } = twgl;

export interface ISceneOptions  {
  fieldOfView: number;
  rotation: IPoint;
  translation: IPoint;
  percentage: number;
}

export function scene(canvas: HTMLCanvasElement, heightMap: IHeightMap, sceneOptions: ISceneOptions, colors: Record<string, RGBA>): void {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;
  const { percentage, fieldOfView, rotation = [0, 0, 0], translation = [0, 0, 1] } = sceneOptions;
  const { primary } = colors;
  const { matrix } = heightMap;
  const width = matrix.length - 1;
  const depth = matrix[0].length - 1;
  const height = width / 3;
  const projection = m4.perspective(
    fieldOfView * Math.PI / PIdeg,   // field of view
    canvas.clientWidth / canvas.clientHeight, // aspect
    1,  // near
    (width + 1) * 3,  // far
  );
  const cameraPosition = [-width, height, -depth];
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
      const y = Number(greyscale) * height * (2 * percentage / TotalDegrees) / TotalRGB;

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

  draw(canvas, gl.LINES, points, indexes, mat, primary);
}
