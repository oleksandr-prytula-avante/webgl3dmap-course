export const fragmentShader = `
precision highp float;
uniform vec4 color;
void main(void) {
  gl_FragColor = color;
}`;
