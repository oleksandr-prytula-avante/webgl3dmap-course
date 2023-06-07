import * as twgl from 'twgl.js';

export function createTexture(gl: WebGLRenderingContext, src: string): Promise<Error | WebGLTexture> {
  return new Promise(function (resolve, reject): void {
    twgl.createTexture(gl, {
      src,
      minMag: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    }, function (error: Error, texture: WebGLTexture) {
      if (error) {
        reject(error);

        return;
      }

      resolve(texture);
    });
  });
}
