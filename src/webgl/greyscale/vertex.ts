export const vertexShader = `
attribute vec4 position;
attribute vec2 texcoord;

uniform sampler2D displacementMap;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform float scale;
varying vec2 v_texcoord;

void main() {
  vec4 tex = texture2D(displacementMap, texcoord);
  float h = (tex.r + tex.g + tex.b) * 0.33;
  float displacement = h * scale;
  vec4 displacedPosition = position + vec4(0, displacement, 0, 0);

  gl_Position = projection * view * model * displacedPosition;
  v_texcoord = texcoord;
}`;
