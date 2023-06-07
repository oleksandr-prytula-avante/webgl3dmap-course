import * as twgl from 'twgl.js';

import { TotalDegrees } from '@/constants/color';
import { IHeightMap } from "@/interfaces/IHeightMap";
import { RGBA } from "@/interfaces/ILandscape";
import { IPoint } from '@/interfaces/IPrimitive';
import { PIdeg } from '@/constants/WEGBL';

import { vertexShader } from './vertex';
import { fragmentShader } from './fragment';
import { createTexturePromisify } from '../texture';

const { m4 } = twgl;

export interface ISceneOptions  {
  fieldOfView: number;
  rotation: IPoint;
  translation: IPoint;
  percentage: number;
}

export async function scene(canvas: HTMLCanvasElement, heightMap: IHeightMap, sceneOptions: ISceneOptions, colors: Record<string, RGBA>): Promise<void> {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;
  const { fieldOfView, percentage, translation, rotation } = sceneOptions;
  const { matrix } = heightMap;
  const width = matrix.length;
  const depth = matrix[0].length;
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
  const scale = height * (2 * percentage / TotalDegrees);

  let model = m4.identity();

  model = m4.translate(model, translation);
  model = m4.rotateX(model, rotation[0] * Math.PI / PIdeg);
  model = m4.rotateY(model, rotation[1] * Math.PI / PIdeg);
  model = m4.rotateZ(model, rotation[2] * Math.PI / PIdeg);

  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  const bufferInfo = twgl.primitives.createPlaneBufferInfo(
    gl,
    width,
    depth,
    width,
    depth
  );
  const displacementMap = await createTexturePromisify(gl, heightMap.greyscaleImage);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniformsAndBindTextures(programInfo, {
    projection,
    view,
    model,
    scale,
    displacementMap,
  });

  twgl.drawBufferInfo(gl, bufferInfo);
}
