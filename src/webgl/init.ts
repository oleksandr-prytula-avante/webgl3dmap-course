import * as twgl from 'twgl.js';

export function init(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  twgl.resizeCanvasToDisplaySize(canvas, window.devicePixelRatio);
  gl.viewport(0, 0, canvas.width, canvas.height);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clearColor(1, 1, 1, 1);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
}
