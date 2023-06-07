import * as twgl from 'twgl.js';

export function createTexturePromisify(gl: WebGLRenderingContext, image: string): Promise<WebGLTexture | Error> {
  return new Promise(function (resolve, reject): void {
    twgl.createTexture(gl, {
      src: image,
      minMag: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    }, function (error: Error, displacementMap: WebGLTexture): void {
      console.warn(error, displacementMap);

      if (error) {
        reject (error);

        return;
      }

      resolve(displacementMap);
    })
  });
}
