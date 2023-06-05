
import * as twgl from 'twgl.js';

import { RGBA } from '@/interfaces/ILandscape';
import { PointLength } from '@/constants/WEGBL';

import { vertexShader } from './shaders/vertex';
import { fragmentShader } from './shaders/fragment';

export function draw(canvas: HTMLCanvasElement, primitiveType: number, points: number[], indexes: number[], mat: twgl.m4.Mat4, color: RGBA): void {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;
  const program = twgl.createProgram(gl, [vertexShader, fragmentShader]);
  const positionLocation = gl.getAttribLocation(program, 'position');
  const matrixLocation = gl.getUniformLocation(program, 'matrix');
  const colorLocation = gl.getUniformLocation(program, 'color');
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const [red, green, blue, alpha] = color;

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(
    positionLocation,  // location
    PointLength,   // size
    gl.FLOAT,     // type
    false,        // normalize
    0,            // stride
    0,            // offset
  );
  gl.useProgram(program);

  gl.uniform4f(colorLocation, red, green, blue, alpha);
  gl.uniformMatrix4fv(matrixLocation, false, mat);

  gl.drawElements(
    primitiveType,      // primitive type
    indexes.length,     // total of vertex
    gl.UNSIGNED_SHORT,  // type of indices
    0,                  // offset
  );
}
